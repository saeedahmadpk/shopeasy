/* ShopEasy — script.js | products, filter, search, sort, working cart */
const PRODUCTS = [
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

let cart = JSON.parse(localStorage.getItem("shopeasy-cart") || "[]");
let activeFilter = "all";

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

/* Checkout (demo) */
const modal = document.getElementById("checkoutModal");
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) { showToast("Your cart is empty"); return; }
  document.getElementById("orderMsg").textContent =
    `Thank you! Your order of ${cartQty()} item(s) — $${cartTotal().toFixed(2)} — has been placed. Free delivery on its way!`;
  cart = []; saveCart(); renderCart(); closeCart();
  modal.hidden = false;
});
function closeModal() { modal.hidden = true; }
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modalDoneBtn").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

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
