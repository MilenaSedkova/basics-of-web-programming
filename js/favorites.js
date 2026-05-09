/**
 * Страница "Избранное"
 */

import {
  getFavoritesWithDetails,
  removeFromFavorites,
  addToCart,
  showNotification
} from './api.js';

const elements = {
  container: document.getElementById('favoritesContainer'),
  noFavorites: document.getElementById('noFavorites'),
  favoritesCount: document.getElementById('favoritesCount'),
  cartCount: document.getElementById('cartCount')
};

async function init() {
  await loadFavorites();
  await updateHeaderCounts();
}

async function loadFavorites() {
  try {
    const services = await getFavoritesWithDetails();
    
    if (services.length === 0) {
      elements.container.style.display = 'none';
      elements.noFavorites.style.display = 'block';
      return;
    }
    
    elements.noFavorites.style.display = 'none';
    elements.container.style.display = 'grid';
    elements.container.innerHTML = services.map(service => `
      <article class="service-card" data-id="${service.id}">
        <img src="${service.image}" alt="${service.name}" class="card-image">
        <div class="card-content">
          <span class="card-category">${service.category}</span>
          <h3 class="card-title">${service.name}</h3>
          <p class="card-description">${service.description}</p>
          <div class="card-meta">
            <span class="card-price">$${service.price}</span>
            <span class="card-rating">${''.repeat(Math.round(service.rating))} ${service.rating}</span>
          </div>
          <div class="card-actions">
            <button class="btn-icon btn-remove" data-id="${service.id}" title="Remove from favorites">✕</button>
            <button class="btn-icon btn-cart" data-id="${service.id}" title="Add to cart">
                <img src="../pictures/cart-icon.svg" alt="Cart">
                </button>
          </div>
        </div>
      </article>
    `).join('');
    
    // Обработчики кнопок
    document.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => handleRemove(e, btn.dataset.id));
    });
    
    document.querySelectorAll('.btn-cart').forEach(btn => {
      btn.addEventListener('click', (e) => handleAddToCart(e, btn.dataset.id));
    });
    
  } catch (error) {
    console.error('Failed to load favorites:', error);
    elements.container.innerHTML = '<p class="error">Failed to load favorites.</p>';
  }
}

async function handleRemove(e, favoriteId) {
  e.preventDefault();
  e.stopPropagation();
  
  try {
    await removeFromFavorites(favoriteId);
    showNotification('Removed from favorites');
    await loadFavorites();
    await updateHeaderCounts();
  } catch (error) {
    showNotification('Failed to remove', 'error');
  }
}

async function handleAddToCart(e, serviceId) {
  e.preventDefault();
  e.stopPropagation();
  
  try {
    await addToCart(serviceId);
    showNotification('Added to cart! 🛒');
    await updateHeaderCounts();
  } catch (error) {
    showNotification('Failed to add to cart', 'error');
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