/**
 * Страница "Корзина"
 */

import {
  getCartWithDetails,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  showNotification
} from './api.js';

const elements = {
  cartItems: document.getElementById('cartItems'),
  emptyCart: document.getElementById('emptyCart'),
  subtotalEl: document.getElementById('subtotal'),
  discountEl: document.getElementById('discount'),
  totalEl: document.getElementById('total'),
  checkoutBtn: document.getElementById('checkoutBtn'),
  favoritesCount: document.getElementById('favoritesCount'),
  cartCount: document.getElementById('cartCount')
};

async function init() {
  await loadCart();
  await updateHeaderCounts();
  
  // Обработчик оформления заказа
  elements.checkoutBtn.addEventListener('click', handleCheckout);
}

async function loadCart() {
  try {
    const items = await getCartWithDetails();
    
    if (items.length === 0) {
      elements.cartItems.style.display = 'none';
      elements.emptyCart.style.display = 'block';
      elements.checkoutBtn.disabled = true;
      updateTotals(0);
      return;
    }
    
    elements.emptyCart.style.display = 'none';
    elements.cartItems.style.display = 'block';
    elements.checkoutBtn.disabled = false;
    
    elements.cartItems.innerHTML = `
      <div class="cart-list">
        ${items.map(item => `
          <article class="cart-item" data-cart-id="${item.cartId}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
              <h4 class="cart-item-title">${item.name}</h4>
              <p class="cart-item-category">${item.category}</p>
              <p class="cart-item-price">$${item.price} × <span class="quantity">${item.cartQuantity}</span></p>
            </div>
            <div class="cart-item-actions">
              <div class="quantity-control">
                <button class="qty-btn qty-minus" data-id="${item.cartId}">−</button>
                <span class="qty-value">${item.cartQuantity}</span>
                <button class="qty-btn qty-plus" data-id="${item.cartId}">+</button>
              </div>
              <button class="btn-remove" data-id="${item.cartId}">Remove</button>
            </div>
          </article>
        `).join('')}
      </div>
    `;
    
    // Считаем и показываем итоги
    const total = items.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
    updateTotals(total);
    
    // Вешаем обработчики
    setupCartItemListeners(items);
    
  } catch (error) {
    console.error('Failed to load cart:', error);
    elements.cartItems.innerHTML = '<p class="error">Failed to load cart.</p>';
  }
}

function setupCartItemListeners(items) {
  // Удаление из корзины
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const cartId = e.currentTarget.dataset.id;
      try {
        await removeFromCart(cartId);
        showNotification('Removed from cart');
        await loadCart();
        await updateHeaderCounts();
      } catch (error) {
        showNotification('Failed to remove', 'error');
      }
    });
  });
  
  // Изменение количества
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const cartId = e.currentTarget.dataset.id;
      const item = items.find(i => i.cartId == cartId);
      if (item && item.cartQuantity > 1) {
        await updateCartQuantity(cartId, item.cartQuantity - 1);
        await loadCart();
        await updateHeaderCounts();
      }
    });
  });
  
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const cartId = e.currentTarget.dataset.id;
      const item = items.find(i => i.cartId == cartId);
      if (item) {
        await updateCartQuantity(cartId, item.cartQuantity + 1);
        await loadCart();
        await updateHeaderCounts();
      }
    });
  });
}

function updateTotals(subtotal) {
  const discount = 0; // Можно добавить логику скидок
  const total = subtotal - discount;
  
  elements.subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  elements.discountEl.textContent = `-$${discount.toFixed(2)}`;
  elements.totalEl.textContent = `$${total.toFixed(2)}`;
}

async function handleCheckout() {
  try {
    // Имитация процесса оплаты
    elements.checkoutBtn.disabled = true;
    elements.checkoutBtn.textContent = 'Processing...';
    
    // Здесь можно добавить реальную интеграцию с платёжной системой
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Очищаем корзину на сервере
    await clearCart();
    
    showNotification('Purchase successful! Thank you!');
    
    // Перенаправляем или обновляем
    setTimeout(() => {
      window.location.href = 'catalog.html';
    }, 2000);
    
  } catch (error) {
    console.error('Checkout failed:', error);
    showNotification('Checkout failed. Please try again.', 'error');
    elements.checkoutBtn.disabled = false;
    elements.checkoutBtn.textContent = 'Proceed to Checkout';
  }
}

async function updateHeaderCounts() {
  try {
    const { data: favorites } = await fetch('http://localhost:3000/favorites').then(r => r.json());
    const { data: cart } = await fetch('http://localhost:3000/cart').then(r => r.json());
    
    elements.favoritesCount.textContent = favorites.length;
    elements.cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error('Failed to update counts:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);