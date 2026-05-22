const CART_KEY = 'cbp_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

function addToCartFromCard(btn) {
  const card = btn.closest('.product-card');
  const name  = card.dataset.name;
  const price = parseFloat(card.dataset.price);

  const cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart(cart);
  openCart();
}

function removeFromCart(name) {
  saveCart(getCart().filter(i => i.name !== name));
}

function updateQty(name, delta) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    saveCart(cart.filter(i => i.name !== name));
  } else {
    saveCart(cart);
  }
}

function getTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function renderCart() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });

  const list = document.getElementById('cart-items');
  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  } else {
    list.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQty('${item.name}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.name}', 1)">+</button>
          <button class="cart-remove" onclick="removeFromCart('${item.name}')">&times;</button>
        </div>
      </div>
    `).join('');
  }

  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = '$' + getTotal().toFixed(2);
}

function openCart() {
  document.getElementById('cart-overlay').classList.add('active');
  document.getElementById('cart-drawer').classList.add('active');
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('active');
  document.getElementById('cart-drawer').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', renderCart);
