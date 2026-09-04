# OneOs Pos roles and daily use

## Super admin

Open `/superadmin/login`. The super admin manages the SaaS platform, not daily restaurant billing.

- Dashboard: active-tenant and platform totals
- Tenants: create a restaurant tenant, edit its details/status, review subscription history or remove a test tenant
- Reports: platform-wide summary data

Deleting a tenant is destructive. Back up the database and confirm the exact tenant before doing it in production.

## Restaurant admin/owner

Open `/login`. A restaurant admin controls only their tenant.

Recommended first-time setup order:

1. Store Settings: restaurant name, address, contact details, logo and QR settings.
2. Tax Setup and Service Charge: create the rates used for billing.
3. Payment Types: enable Cash, UPI, Card or other accepted methods.
4. Store Tables: add table names/numbers and floors when dine-in is used.
5. Inventory: add ingredients/items, units, opening quantity and low-stock threshold.
6. Menu Items: add categories and products, then variants/add-ons and recipes.
7. Print Settings: select A4 for the current requirement. Choose 57/80 mm Bluetooth only for a compatible thermal printer.
8. Users: add staff and grant only the scopes needed for their job.

Daily flow:

1. POS: select products, variants and add-ons; choose dine-in/takeaway and customer/table; save unpaid or pay immediately.
2. Kitchen: move items through created/preparing/completed states.
3. Orders: group open orders by table, cancel where authorized, calculate the bill and complete payment.
4. Invoices: search and reprint completed bills.
5. Inventory: receive/adjust stock and review automatic recipe deductions.
6. Dashboard/Reports: review sales, orders, top items and customer information.

QR ordering lets a guest open the restaurant's public menu and place an order. Staff review incoming QR orders in POS/Kitchen and accept/process them in the normal workflow.

## Staff roles

Staff access is scope-based rather than fixed to a single hard-coded job title. An admin can combine these permissions:

- POS: create customer orders and payments
- Orders: review and complete orders
- Order Status/Kitchen Display: update food preparation state
- Inventory: manage stock and movement logs
- Customers/Reservations: manage guest data and bookings
- Users: manage staff accounts (give this only to trusted managers)
- Reports: see business performance
- Settings: change store/menu/tax/payment configuration (admin/manager only)

A staff user without a scope receives a 403 response and should not see or use that protected page.

## Printing

For the current setup, use A4:

1. Go to Settings → Print Settings.
2. Select A4/System Print and save.
3. Print from the invoice/order action and choose the installed A4 printer in the browser print dialog.

Bluetooth mode is intended for ESC/POS thermal printers. Pair from the print action when prompted; the browser must run over HTTPS. Test receipt width, character encoding, cutter and cash-drawer behavior on the exact printer model before using it at the counter.

## Local data versus production data

Local and production databases are separate. Data entered locally does not appear after deployment unless you export/import or run a seed against production. Code deployment does not copy the local database and does not remove existing production data when the deployment guide is followed.
