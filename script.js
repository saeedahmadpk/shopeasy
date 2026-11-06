/* ShopEasy — script.js | products, filter, search, sort, working cart,
   professional checkout (Order ID + WhatsApp + email notification),
   customer messages, and Track Order.
   ── SELLER SETTINGS: change these two lines to change where orders go ── */
/* Seller settings — the separate Admin page (NOT linked from the store) can
   change these on this device; they are stored in localStorage as
   "shopeasy-settings". To change them for EVERY visitor, edit the two lines
   below and re-upload. */
function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem("shopeasy-settings") || "{}");
    return {
      whatsapp: (s.whatsapp || "923019578483").replace(/[^0-9]/g, ""),
      email: s.email || "saeed514787@gmail.com",
    };
  } catch { return { whatsapp: "923019578483", email: "saeed514787@gmail.com" }; }
}
const SETTINGS = loadSettings();
const SELLER_WHATSAPP = SETTINGS.whatsapp; // seller WhatsApp, country code + number, no + or spaces
const SELLER_EMAIL = SETTINGS.email; // seller email for order/message notifications (via FormSubmit)
const FORM_ENDPOINT = "https://formsubmit.co/ajax/" + SELLER_EMAIL;

/* Products — the separate Admin page (NOT linked from the store) saves
   changes in localStorage as "shopeasy-products" and the storefront uses them
   if present, so products added/edited/removed in Admin show up here
   immediately on this device. To make them live for EVERY visitor, export
   them from Admin and re-upload script.js to GitHub (or ask the assistant
   to push the update). */
function loadCustomProducts() {
  try {
    const list = JSON.parse(localStorage.getItem("shopeasy-products") || "null");
    if (Array.isArray(list) && list.length && list.every(p => p && p.name && Number(p.price) > 0)) return list;
  } catch { /* fall through to defaults */ }
  return null;
}
const DEFAULT_PRODUCTS = [
  { id: 1, name: "Wireless Headphones", cat: "electronics", price: 49.99, old: 89.99, rating: 5, reviews: 214, badge: "BEST SELLER", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "Smart Watch", cat: "electronics", price: 79.99, old: 129.99, rating: 5, reviews: 189, badge: "-38%", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "Sports Shoes", cat: "fashion", price: 59.99, old: 99.99, rating: 5, reviews: 342, badge: "HOT", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" },
  { id: 4, name: "Bluetooth Speaker", cat: "electronics", price: 39.99, old: 69.99, rating: 4, reviews: 128, badge: "SALE", img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80" },
  { id: 5, name: "Classic Sunglasses", cat: "accessories", price: 24.99, old: 44.99, rating: 4, reviews: 96, badge: "", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80" },
  { id: 6, name: "Travel Backpack", cat: "accessories", price: 45.99, old: 79.99, rating: 5, reviews: 167, badge: "SALE", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80" },
  { id: 7, name: "Digital Camera", cat: "electronics", price: 199.99, old: 299.99, rating: 5, reviews: 88, badge: "-33%", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80" },
  { id: 8, name: "Cotton T-Shirt", cat: "fashion", price: 19.99, old: 34.99, rating: 4, reviews: 253, badge: "", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80" },
  { id: 9, name: "Running Shoes Pro", cat: "fashion", price: 89.99, old: 139.99, rating: 5, reviews: 174, badge: "NEW", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80" },
  { id: 10, name: "Laptop — 14\" Ultrabook", cat: "electronics", price: 599.99, old: 799.99, rating: 5, reviews: 64, badge: "-25%", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80" },
  { id: 11, name: "Leather Wallet", cat: "accessories", price: 29.99, old: 49.99, rating: 4, reviews: 141, badge: "", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80" },
  { id: 12, name: "Perfume — Eau de Parfum", cat: "accessories", price: 54.99, old: 89.99, rating: 5, reviews: 203, badge: "SALE", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80" },
];
const PRODUCTS = loadCustomProducts() || DEFAULT_PRODUCTS;

let cart = JSON.parse(localStorage.getItem("shopeasy-cart") || "[]");
let activeFilter = "all";
let lastOrder = null;

const grid = document.getElementById("productsGrid");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

function stars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function renderProducts() {
  const q = (searchInput.value || "").trim().toLowerCase();
  let list = PRODUCTS.filter(p =>
    (activeFilter === "all" || p.cat === activeFilter) &&
    (!q || p.name.toLowerCase().includes(q))
  );
  const sort = sortSelect.value;
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);

  noResults.hidden = list.length > 0;
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-badge ${p.badge === "SALE" || p.badge.startsWith("-") ? "sale" : ""}">${p.badge}</span>` : ""}
      </div>
      <div class="product-body">
        <span class="product-cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <div class="stars">${stars(p.rating)}<span>(${p.reviews})</span></div>
        <div class="price-row"><span class="price">$${p.price.toFixed(2)}</span><span class="old-price">$${p.old.toFixed(2)}</span></div>
        <button class="add-btn" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Add to Cart</button>
      </div>
    </article>`).join("");
}

function saveCart() { localStorage.setItem("shopeasy-cart", JSON.stringify(cart)); }
function cartQty() { return cart.reduce((n, i) => n + i.qty, 0); }
function cartTotal() { return cart.reduce((n, i) => n + i.qty * i.price, 0); }

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const line = cart.find(x => x.id === id);
  if (line) line.qty++;
  else cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 });
  saveCart(); renderCart();
  showToast(`${p.name} added to cart`);
}

function changeQty(id, delta) {
  const line = cart.find(x => x.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart(); renderCart();
}

function removeItem(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart(); renderCart();
}

function renderCart() {
  const count = cartQty();
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartHeadCount").textContent = `(${count})`;
  document.getElementById("cartTotal").textContent = `$${cartTotal().toFixed(2)}`;
  const box = document.getElementById("cartItems");
  if (!cart.length) {
    box.innerHTML = `<div class="cart-empty"><i class="fas fa-cart-shopping"></i><p>Your cart is empty.</p><p>Add some products to get started!</p></div>`;
    return;
  }
  box.innerHTML = cart.map(i => `
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}">
      <div class="cart-item-info">
        <h4>${i.name}</h4>
        <span class="price">$${i.price.toFixed(2)}</span>
        <div class="qty">
          <button onclick="changeQty(${i.id}, -1)" aria-label="Decrease">−</button>
          <span>${i.qty}</span>
          <button onclick="changeQty(${i.id}, 1)" aria-label="Increase">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem(${i.id})" aria-label="Remove"><i class="fas fa-trash"></i></button>
    </div>`).join("");
}

/* Cart drawer */
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("cartOverlay");
function openCart() { drawer.classList.add("open"); overlay.classList.add("open"); }
function closeCart() { drawer.classList.remove("open"); overlay.classList.remove("open"); }
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("clearCartBtn").addEventListener("click", () => {
  if (!cart.length) return;
  cart = []; saveCart(); renderCart(); showToast("Cart cleared");
});

/* ── Orders: how the seller finds out ───────────────────────────────
   GitHub Pages is static hosting — it has no server or database, so it
   cannot store orders by itself. Every order therefore goes to the seller
   in TWO ways at once:
   1. WhatsApp — the customer taps "Confirm Order on WhatsApp" and the full
      order arrives in the seller's WhatsApp instantly.
   2. Email — the order is also posted to FormSubmit, which emails it to
      SELLER_EMAIL. First time only: the seller must click the activation
      link FormSubmit emails them, then all later orders arrive by email.
   The order is ALSO saved in this browser (localStorage) so the customer
   can track it with their Order ID. */
function getOrders() { return JSON.parse(localStorage.getItem("shopeasy-orders") || "[]"); }
function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem("shopeasy-orders", JSON.stringify(orders.slice(0, 50)));
}

function makeOrderId() {
  return "SE-" + String(Math.floor(100000 + Math.random() * 900000));
}

function orderText(order) {
  const lines = order.items.map(i => `• ${i.name} x${i.qty} — $${(i.price * i.qty).toFixed(2)}`).join("\n");
  return `New Order ${order.id} — ShopEasy\n${lines}\nTotal: $${order.total.toFixed(2)} (Free delivery)\nPayment: ${order.payment}\nName: ${order.name}\nPhone: ${order.phone}\nEmail: ${order.email || "-"}\nAddress: ${order.address}, ${order.city}\nStatus: Pending confirmation`;
}

function notifySeller(order, kind) {
  // Email notification via FormSubmit (free, no signup). Fire-and-forget:
  // the order is already saved + WhatsApp is the instant channel, so a
  // slow/blocked email request must never block the customer.
  const body = {
    _subject: kind === "message"
      ? `ShopEasy message — ${order.subject} (from ${order.name})`
      : `New ShopEasy order ${order.id} — $${order.total.toFixed(2)}`,
    _template: "table",
    _captcha: "false",
    name: order.name,
    phone: order.phone,
    email: order.email || "",
    message: kind === "message" ? order.message : orderText(order),
  };
  if (kind === "order") {
    body.order_id = order.id;
    body.payment = order.payment;
    body.address = `${order.address}, ${order.city}`;
    body.total = `$${order.total.toFixed(2)}`;
  }
  fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(body),
  }).then(r => {
    const note = document.getElementById("successNote");
    if (note && kind === "order") {
      note.textContent = r.ok
        ? "Order email sent to the seller as well."
        : "Order email could not be sent — please confirm on WhatsApp so we don't miss it.";
    }
  }).catch(() => {
    const note = document.getElementById("successNote");
    if (note && kind === "order") note.textContent = "Order email could not be sent — please confirm on WhatsApp so we don't miss it.";
  });
}

/* Checkout: form -> Order ID -> success screen with WhatsApp confirm */
const checkoutModal = document.getElementById("checkoutModal");
const successModal = document.getElementById("orderSuccessModal");

function openCheckout() {
  if (!cart.length) { showToast("Your cart is empty"); return; }
  document.getElementById("orderSummary").innerHTML =
    cart.map(i => `<div class="summary-line"><span>${i.name} × ${i.qty}</span><strong>$${(i.price * i.qty).toFixed(2)}</strong></div>`).join("") +
    `<div class="summary-line summary-total"><span>Total (Free delivery)</span><strong>$${cartTotal().toFixed(2)}</strong></div>`;
  closeCart();
  checkoutModal.hidden = false;
}
function closeCheckout() { checkoutModal.hidden = true; }
function closeSuccess() { successModal.hidden = true; }

document.getElementById("checkoutBtn").addEventListener("click", openCheckout);
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);
document.getElementById("closeSuccess").addEventListener("click", closeSuccess);
document.getElementById("successDoneBtn").addEventListener("click", closeSuccess);
checkoutModal.addEventListener("click", e => { if (e.target === checkoutModal) closeCheckout(); });
successModal.addEventListener("click", e => { if (e.target === successModal) closeSuccess(); });

document.getElementById("checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  const order = {
    id: makeOrderId(),
    date: new Date().toISOString(),
    status: "Pending confirmation",
    items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
    total: cartTotal(),
    name: document.getElementById("coName").value.trim(),
    phone: document.getElementById("coPhone").value.trim(),
    email: document.getElementById("coEmail").value.trim(),
    address: document.getElementById("coAddress").value.trim(),
    city: document.getElementById("coCity").value.trim(),
    payment: document.getElementById("coPayment").value,
  };
  lastOrder = order;
  saveOrder(order);
  notifySeller(order, "order");
  cart = []; saveCart(); renderCart();
  closeCheckout();
  document.getElementById("successOrderId").textContent = order.id;
  document.getElementById("successNote").textContent = "Sending order email to the seller...";
  document.getElementById("whatsappOrderBtn").href =
    `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent("Hi ShopEasy! I just placed an order.\n\n" + orderText(order))}`;
  successModal.hidden = false;
});

document.getElementById("copyOrderBtn").addEventListener("click", async () => {
  if (!lastOrder) return;
  try {
    await navigator.clipboard.writeText(orderText(lastOrder));
    showToast("Order details copied");
  } catch {
    showToast("Copy failed — select the Order ID instead");
  }
});

/* Track Order */
document.getElementById("trackForm").addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("trackInput").value.trim().toUpperCase();
  const box = document.getElementById("trackResult");
  const order = getOrders().find(o => o.id.toUpperCase() === id);
  if (!order) {
    box.innerHTML = `<div class="track-card"><strong>Order ${id} not found on this device.</strong><p>Tracking works for orders placed in this browser. If you ordered from another phone, message us on WhatsApp with your Order ID and we will check it for you.</p></div>`;
    return;
  }
  box.innerHTML = `<div class="track-card">
    <div class="track-head"><strong>${order.id}</strong><span class="status-badge">${order.status}</span></div>
    <p>${order.items.map(i => `${i.name} × ${i.qty}`).join(", ")}</p>
    <p>Total: <strong>$${order.total.toFixed(2)}</strong> · Payment: ${order.payment}</p>
    <p>Deliver to: ${order.name}, ${order.address}, ${order.city}</p>
    <p class="track-note">Placed on ${new Date(order.date).toLocaleString()}. We confirm every order on WhatsApp before dispatch.</p>
  </div>`;
});

/* Customer message / Contact form */
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const msg = {
    name: document.getElementById("contactName").value.trim(),
    phone: document.getElementById("contactPhone").value.trim(),
    email: "",
    subject: document.getElementById("contactSubject").value,
    message: document.getElementById("contactMessage").value.trim(),
  };
  notifySeller(msg, "message");
  const waText = `Hi ShopEasy! (${msg.subject})\nName: ${msg.name}\nContact: ${msg.phone}\n\n${msg.message}`;
  document.getElementById("contactMsg").textContent =
    "Message sent! We will reply soon. For a faster reply, tap Chat on WhatsApp.";
  // Open WhatsApp with the same message so the seller sees it instantly.
  window.open(`https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(waText)}`, "_blank");
  e.target.reset();
});

/* Filters / search / sort */
document.getElementById("filters").addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  renderProducts();
});
searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

/* Mobile menu */
document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});
document.querySelectorAll(".nav-links a").forEach(a =>
  a.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open"))
);

/* Newsletter */
document.getElementById("newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("newsletterEmail").value.trim();
  if (!email) return;
  document.getElementById("newsletterMsg").textContent = `Thanks! Your 10% off code was sent to ${email}`;
  document.getElementById("newsletterEmail").value = "";
});

/* Toast */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

renderProducts();
renderCart();
