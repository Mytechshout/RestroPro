# OneOs Pos

OneOs Pos is a multi-tenant restaurant point-of-sale application based on the MIT-licensed [RestroPro](https://github.com/TheNeovimmer/RestroPro) project.

## Stack

- Frontend: React 18, Vite, Tailwind CSS, DaisyUI, SWR, Socket.IO client and PWA support
- Backend: Node.js, Express, MySQL2, JWT cookie authentication and Socket.IO
- Database: MySQL 8 or MariaDB 10.4+
- Production: Nginx/aaPanel with Cloudflare DNS and TLS

## Verified features

- Multi-tenant restaurant accounts and subscription state
- Restaurant admin/staff authentication with scope-based permissions
- Super-admin tenant dashboard, tenant management, reports and subscription history
- Categories, menu items, variants, add-ons, taxes and payment types
- POS orders, kitchen status workflow, invoices and QR-menu orders
- Tables, reservations, customers, staff users and CSV customer import
- Inventory, recipes, automatic stock deduction and stock movement logs
- Sales dashboards, reports and customer feedback
- A4 browser/system printing and 57/80 mm Web Bluetooth thermal printing
- Responsive restaurant and super-admin dashboards

External services require their own configuration: SMTP for password-reset email, Stripe for subscriptions, and compatible printer hardware for physical print testing. There is no Zomato synchronization; the Pranav catalogue is an optional local seed based on the supplied public menu.

## Local setup

Requirements: Node.js 20 LTS, npm and MySQL/MariaDB.

```powershell
git clone <your-fork-url>
cd RestroPro
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
cd backend
npm ci
cd ../frontend
npm ci
```

Create a database and import the initial schema:

```powershell
mysql -u root -p -e "CREATE DATABASE oneos_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
cmd /c "mysql -u root -p oneos_pos < backend\restropro_saas.sql"
```

Set `DATABASE_URL` and secure secrets in `backend/.env`. For local development, set both frontend/backend domain values to `http://localhost:5173` and backend URLs to `http://localhost:3000`.

Start each application in a separate terminal:

```powershell
cd backend
npm run dev
```

```powershell
cd frontend
npm run dev
```

Open `http://localhost:5173`. The super-admin login is at `http://localhost:5173/superadmin/login`.

## Utility commands

```powershell
# Backend: create/update the super administrator from environment variables
$env:SUPERADMIN_EMAIL="super@admin.com"
$env:SUPERADMIN_PASSWORD="<strong-password>"
$env:SUPERADMIN_NAME="Super Admin"
npm run create-superadmin

# Backend: idempotently seed the existing Pranav tenant
npm run seed:pranav-demo -- admin@pranav.com

# Frontend production build
cd ../frontend
npm run build
```

Do not commit either `.env` file or real credentials.

## Documentation

- [Functional audit](FUNCTIONAL_AUDIT.md)
- [aaPanel deployment guide](AAPPANEL_DEPLOYMENT.md)
- [User and role guide](OPERATIONS_GUIDE.md)

## License and support

The upstream project is licensed under the MIT License; retain the repository `LICENSE` file and copyright notice. Project support: [support@pixelperfect.co.in](mailto:support@pixelperfect.co.in).
