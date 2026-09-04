# OneOs Pos — manual aaPanel deployment

This release uses one public origin: `https://pos.oneos.in`. Nginx serves the React build and proxies `/api`, `/public` and `/socket.io` to the Node.js backend.

Recommended directories:

- Frontend web root: `/www/wwwroot/pos.oneos.in`
- Backend project: `/www/wwwroot/oneos-pos-backend`
- Backend local port: `3000`

If your existing backend uses a different directory or port, keep those existing values and substitute them below.

## 1. Back up production first

In aaPanel, back up both the `pos.oneos.in` website and its MySQL database. Also copy these backend items separately:

- `.env`
- `public/` (restaurant/user uploaded images)
- `tmp/`, if it contains files you need

Never upload the repository's local `.env` over production. Never import `restropro_saas.sql` into an existing production database; it is only for a new empty installation.

## 2. Upload the backend package

1. Stop the OneOs Pos Node project in **aaPanel → Website → Node Project**.
2. Open `/www/wwwroot/oneos-pos-backend` in File Manager.
3. Upload `oneos-pos-backend-functional-audit-v3.zip` and extract it into that directory, overwriting code files when asked.
4. Confirm that the production `.env` and existing `public/` directory are still present.
5. Open aaPanel Terminal and run:

```bash
cd /www/wwwroot/oneos-pos-backend
npm ci --omit=dev
```

Use Node.js 20 LTS. Configure the Node project as:

- Project directory: `/www/wwwroot/oneos-pos-backend`
- Startup file: `index.js`
- Run user: the same aaPanel website/Node user used previously
- Port: `3000`
- Start command: `node index.js`

Required production `.env` values include:

```dotenv
APP_NAME="OneOs Pos"
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@127.0.0.1:3306/DB_NAME"
DATABASE_SSL=false
JWT_SECRET="LONG_RANDOM_SECRET"
JWT_EXPIRY=15m
JWT_EXPIRY_REFRESH=30d
COOKIE_EXPIRY=900000
COOKIE_EXPIRY_REFRESH=2592000000
PASSWORD_SALT=10
FRONTEND_DOMAIN="https://pos.oneos.in"
FRONTEND_DOMAIN_COOKIE="pos.oneos.in"
ENCRYPTION_KEY="A_DIFFERENT_LONG_RANDOM_SECRET"
```

Keep the existing `JWT_SECRET` and `ENCRYPTION_KEY` on an upgrade. Changing them logs everyone out and can make existing encrypted invoice/feedback links unreadable. Add SMTP and Stripe values only when those integrations are required.

This code release has no database schema migration.

## 3. Upload the frontend package

1. Open `/www/wwwroot/pos.oneos.in` in aaPanel File Manager.
2. Upload `oneos-pos-frontend-functional-audit-v3.zip`.
3. Extract it directly into the web root. `index.html`, `assets/`, `sw.js`, and `manifest.webmanifest` must be directly inside `/www/wwwroot/pos.oneos.in`; there must not be an extra `dist` folder.
4. It is safe for old hashed files to remain in `assets/` until the release is confirmed. Remove them later only after checking the backup and current build.

## 4. Configure Nginx reverse proxy and SPA fallback

Add these locations inside the `pos.oneos.in` Nginx `server` block. If aaPanel already generated an equivalent proxy rule, edit it instead of adding a duplicate.

```nginx
location ^~ /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location ^~ /public/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /socket.io/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location = /index.html {
    add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    try_files $uri =404;
}

location = /sw.js {
    add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    try_files $uri =404;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

Save the configuration and use aaPanel's Nginx configuration test. Do not restart Nginx if the test reports an error.

## 5. Start and verify

1. Start/restart the Node project.
2. Reload Nginx.
3. Confirm `https://pos.oneos.in/login` loads.
4. Confirm `https://pos.oneos.in/superadmin/login` loads.
5. Log in as a restaurant admin and check Dashboard, POS, Orders, Kitchen, Inventory, Reports and Settings.
6. Log in as super admin and check Dashboard, Tenants and Reports.
7. At mobile width, open and close the sidebar on both dashboards.
8. Create one test unpaid order, move it through Kitchen, then pay it and confirm the invoice.
9. Confirm an inventory recipe item was deducted and an inventory log was created.
10. In Cloudflare, purge the cache for `pos.oneos.in`, then hard-refresh the browser. If the old PWA remains, unregister its service worker or clear site data once.

Use Cloudflare SSL/TLS mode **Full (strict)** after installing a valid origin certificate in aaPanel. Keep the `pos` DNS A record proxied only after direct origin access and SSL are working.

## 6. Optional production data commands

The existing production database already keeps its data during code deployment. Local test data never moves automatically.

Create/update a super-admin only when needed:

```bash
cd /www/wwwroot/oneos-pos-backend
SUPERADMIN_EMAIL='super@admin.com' \
SUPERADMIN_PASSWORD='<strong-password>' \
SUPERADMIN_NAME='Super Admin' \
npm run create-superadmin
```

Seed the Pranav demo catalogue after deployment, when you are ready to add that data to the production tenant:

```bash
cd /www/wwwroot/oneos-pos-backend
npm run seed:pranav-demo -- admin@pranav.com
```

The Pranav seed is idempotent: rerunning it updates/reuses matching records rather than intentionally duplicating them. Take a database backup before the first production run.

## Rollback

If verification fails, stop the Node project, restore the backed-up backend code and frontend web root, restore the prior `.env`, and start the previous project. Restore the database only if a database-changing command was run; normal code deployment does not change the schema.
