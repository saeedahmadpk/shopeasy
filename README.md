# ShopEasy — Online Shopping Website

**Shop Smarter, Live Better.** A complete, responsive online store built with plain
HTML, CSS & JavaScript — no framework, no build step. Based on the "Algorithm Arch"
tutorial screenshot, but finished and working.

## What's inside

| File | What it does |
|---|---|
| `index.html` | Navbar, hero, trust bar, offers, shop, about, newsletter, footer, cart drawer, checkout modal |
| `style.css` | Full responsive styling (blue + yellow theme, mobile menu, cart drawer) |
| `script.js` | 12 products, search, category filter, sort, working cart (add / + / − / remove, saved in `localStorage`), demo checkout, newsletter |
| `README.md` | This file |

## Products (same as the screenshot, plus more)

- Wireless Headphones — **$49.99** (was $89.99)
- Smart Watch — **$79.99** (was $129.99)
- Sports Shoes — **$59.99** (was $99.99)
- + 9 more: Bluetooth Speaker, Sunglasses, Backpack, Camera, T-Shirt, Running Shoes, Laptop, Wallet, Perfume

Offers: **Up to 50% OFF** · **Free Delivery on All Orders** ·
Secure Payment · 24/7 Support · Easy Returns (30 days).

## Run it locally

```bash
# Option 1 — just open it
open index.html        # or double-click the file

# Option 2 — local server (recommended, so images/cart work best)
python3 -m http.server 8000
# then open http://localhost:8000
```

## Put it on GitHub Pages (free hosting)

```bash
cd shopeasy
git init
git add .
git commit -m "ShopEasy online store"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/shopeasy.git
git push -u origin main
```

Then in GitHub: **Repo → Settings → Pages →**
Build and deployment → **Deploy from a branch** → Branch: `main`, Folder: `/ (root)` → Save.

Your live site will be:

```
https://YOUR-USERNAME.github.io/shopeasy/
```

Every `git push` after that updates the live site automatically.

## What was fixed vs. the screenshot's code

The code in the screenshot stops after the hero (`</section></body></html>` on line 41)
and has no products section, no footer, no JavaScript, and it uses Font Awesome
icons (`fas fa-shopping-cart`) without loading the Font Awesome stylesheet — so the
icons would show as blank boxes. This version adds:

1. Font Awesome CDN link in `<head>` (icons actually render)
2. Full products grid, offers, about, newsletter, footer
3. Working cart + search + filter + sort in `script.js`
4. Mobile-responsive layout (menu, 4 → 2 → 1 column grid)

## Next steps (optional)

- Replace the demo checkout with Stripe / PayPal for real payments
- Swap the Unsplash demo photos for your own product photos
- Change the brand name, prices and contact details in `index.html`

## How the seller finds out about orders & messages (professional setup)

GitHub Pages is static hosting — it has no server or database, so it cannot
store orders by itself. Every order and message therefore reaches the seller
in **two ways at once**:

1. **WhatsApp (instant, no setup)** — after placing an order the customer
   sees their Order ID (e.g. `SE-123456`) and a green
   **"Confirm Order on WhatsApp"** button. One tap opens WhatsApp to the
   seller with the full order: items, total, payment method, name, phone,
   address and city. The contact form works the same way.
2. **Email (via FormSubmit, free)** — the order/message is also posted to
   FormSubmit, which emails it to the seller. **First time only:** FormSubmit
   sends an activation email to the seller — click the activation link once,
   then all later orders and messages arrive by email automatically.

### Seller settings — change in `script.js` (top of file)

```js
const SELLER_WHATSAPP = "923019578483"; // WhatsApp, country code + number
const SELLER_EMAIL = "saeed514787@gmail.com";
```

### Customer side

- **Checkout:** name, WhatsApp number, email (optional), address, city,
  payment method (Cash on Delivery / JazzCash / Bank Transfer / Card on
  Delivery) → Order ID is issued, e.g. `SE-123456`.
- **Track Order:** the customer enters their Order ID on the site. Tracking
  works for orders placed in the same browser (orders are saved in
  `localStorage`). Orders from another phone are checked by messaging the
  seller on WhatsApp with the Order ID.
- **Message Us:** name, contact, subject (Order / Product / Return /
  Delivery / Other) and message → email + WhatsApp to the seller.

### If you want a full order dashboard later

That needs a real backend/database (for example the Nexa Store setup with
SQLite + Stripe, or Google Sheets as a free order sheet). WhatsApp + email
is the professional, zero-cost way to start on GitHub Pages.

## Admin Panel — add / remove / edit products, manage orders

Open the secret admin page **`manage-shopeasy-x9.html`** — it is NOT linked
anywhere on the storefront, so customers cannot find it from the website:
`https://saeedahmadpk.github.io/shopeasy/manage-shopeasy-x9.html`
(after the next GitHub upload). Bookmark it and do not share the address.

- **No PIN, no password:** the panel opens directly. That is deliberate —
  a PIN written in a public web page is not real security, anyone can read
  it in the page source. Security here is only "secret URL": anyone who
  learns the address can open it. For a real password login checked on a
  server, the store needs a backend (Vercel/backend option).
- **Dashboard:** product count, order count, pending orders, total sales.
- **Products:** add a product (name, category, price, old price, rating,
  badge, photo URL or a sample photo), edit any product, or remove it.
- **Orders:** orders placed on this device, change status
  (Pending → Confirmed → Shipped → Delivered / Cancelled), message the
  customer on WhatsApp, export orders as CSV.
- **Settings:** change the seller WhatsApp number and email for order
  notifications (on this device).

### Important — local vs live

Admin changes are saved in the browser (`localStorage`) and show on the
storefront **in that browser right away**. To make them live for **every
visitor**:

1. In Admin → Products → **Export Products JSON**, save the file.
2. Send it to the assistant, or paste it into `script.js` as
   `DEFAULT_PRODUCTS` and upload the new `script.js` to the GitHub repo.
3. GitHub Pages rebuilds in a minute or two.

A real shared admin (changes visible to everyone instantly, with real login
security) needs a backend/database — for example the Nexa Store setup
(SQLite + server) — it cannot run on GitHub Pages alone.
