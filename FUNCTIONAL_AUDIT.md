# OneOs Pos functional audit

Audit date: 2026-09-01

The fork was compared with the original RestroPro code, statically checked, built, and exercised against an isolated local MySQL database. The checks below validate application behavior; they are not a substitute for a full security assessment or real printer/payment-provider certification.

## Passed

| Area | Verified behavior |
| --- | --- |
| Authentication | Restaurant sign-up/sign-in, sign-out flow, JWT cookies, super-admin sign-in |
| Authorization | Scope-limited staff can use permitted POS/Orders areas and receives 403 for restricted Settings, Inventory and Reports |
| Tenant isolation | Tenant filters on dashboard/data APIs and invoice feedback/order retrieval |
| Super admin | Dashboard counts, tenants list, add/update/delete test tenant, subscription history and reports |
| Settings | Store settings, service charge, taxes, payment types, tables and A4 print setting |
| Menu | Categories, menu items, variants, add-ons, recipes, image upload/removal and item detail APIs |
| Inventory | Add/update inventory, movement logs, dashboard aggregates and automatic recipe deduction |
| POS and kitchen | Paid order, unpaid order, kitchen item states, order completion/payment and invoice creation |
| QR ordering | Public QR menu, order placement, admin retrieval, recipe data and cancellation |
| Customer operations | Add/update customers and CSV-style bulk import |
| Reservations/users | Add/update reservation and add scoped staff user |
| Reports | Restaurant dashboard, invoice, sales report and inventory-report endpoints |
| Responsive UI | Restaurant dashboard routes and super-admin routes at 390 px with no page-level horizontal overflow; mobile drawer open/close; desktop collapse/expand controls |
| Branding/domain | OneOs Pos name/logo, support email and `pos.oneos.in` production URLs in the build |
| Build/security scan | Frontend production build passes; backend/frontend production dependency audits report zero known vulnerabilities |

## Corrected during audit

- Fixed route ordering that prevented menu add-on and variant endpoints from being reached.
- Fixed inventory update SQL and MariaDB-compatible dashboard aggregation.
- Fixed invoice/order JSON response typos and receipt reprint object handling.
- Fixed QR recipe retrieval and invoice feedback tenant isolation.
- Added order-ID validation and parameterized order/invoice queries.
- Added cleanup so a failed paid order does not leave an orphan invoice.
- Made inventory deduction use database recipes and reject unavailable/insufficient stock transactionally.
- Corrected authentication-cookie cleanup branding.
- Fixed both responsive sidebars and desktop collapse-button stacking/visibility.
- Added A4 system printing and optional Web Bluetooth 57/80 mm thermal printing.

## External or manual prerequisites

- Password-reset email requires valid SMTP settings and must be tested with the chosen mail provider.
- Stripe subscription checkout/webhooks require Stripe keys, product configuration and webhook testing.
- Physical A4 output depends on the browser/printer driver and should be checked with the actual printer.
- Bluetooth printing depends on an ESC/POS-compatible printer and a browser/device that exposes Web Bluetooth; hardware was not available for this audit.
- Legal footer links in the inherited landing page need manager-approved Privacy, Terms and Refund content before a public commercial launch.
- Zomato is a catalogue reference only; there is no delivery-platform API integration or live synchronization.
- The inherited project has no formal unit/integration test suite despite the old README claiming Jest tests. This audit used build/static checks and isolated functional smoke tests.
