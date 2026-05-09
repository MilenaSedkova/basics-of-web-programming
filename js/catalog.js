/**
 * Каталог услуг — работа с JSON Server
 * ВСЯ фильтрация/сортировка/пагинация происходит на сервере!
 */

import {
  getServices,
  getCategories,
  addToFavorites,
  addToCart,
  getFavorites,
  getCart,
  showNotification
} from './api.js';

// состояние приложения
const state = {
  currentPage: 1,
  itemsPerPage: 6,
  filters: {
    search: '',
    category: '',
    sortBy: '',
    order: 'asc',
    minPrice: '',
    maxPrice: ''
  }
};

//  DOM элементы 
const elements = {
  cardsContainer: document.getElementById('cardsContainer'),
  noResults: document.getElementById('noResults'),
  pagination: document.getElementById('pagination'),
  pageInfo: document.getElementById('pageInfo'),
  prevBtn: document.getElementById('prevPage'),
  nextBtn: document.getElementById('nextPage'),
  searchInput: document.getElementById('searchInput'),
  sortSelect: document.getElementById('sortSelect'),
  categorySelect: document.getElementById('categorySelect'),
  minPriceInput: document.getElementById('minPrice'),
  maxPriceInput: document.getElementById('maxPrice'),
  favoritesCount: document.getElementById('favoritesCount'),
  cartCount: document.getElementById('cartCount')
};

// инициализация
async function init() {
  // Загружаем категории для фильтра
  await loadCategories();
  
  // Загружаем первую страницу услуг
  await loadServices();
  
  // Обновляем счётчики в шапке
  await updateHeaderCounts();
  
  // Вешаем обработчики событий
  setupEventListeners();
}

// === Загрузка категорий (Set как в задании) ===
async function loadCategories() {
  try {
    const categories = await getCategories();
    
    // Очищаем и заполняем селект
    elements.categorySelect.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      elements.categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

// === Загрузка услуг с сервера ===
async function loadServices() {
  showLoader(true);
  
  try {
    const { data: services, total } = await getServices({
      page: state.currentPage,
      limit: state.itemsPerPage,
      ...state.filters
    });
    
    renderServices(services);
    renderPagination(total);
    
    // Показываем/скрываем сообщение "ничего не найдено"
    elements.noResults.style.display = services.length === 0 ? 'block' : 'none';
    elements.cardsContainer.style.display = services.length === 0 ? 'none' : 'grid';
    
  } catch (error) {
    console.error('Failed to load services:', error);
    elements.cardsContainer.innerHTML = '<p class="error">Failed to load services. Please try again.</p>';
  } finally {
    showLoader(false);
  }
}

// === Отрисовка карточек ===
function renderServices(services) {
  if (services.length === 0) return;
  
  elements.cardsContainer.innerHTML = services.map(service => `
    <article class="service-card" data-id="${service.id}">
      <img src="${service.image}" alt="${service.name}" class="card-image">
      
      <div class="card-content">
        <span class="card-category">${service.category}</span>
        <h3 class="card-title">${service.name}</h3>
        <p class="card-description">${service.description}</p>
        
        <div class="card-meta">
          <span class="card-price">$${service.price}</span>
          <span class="card-rating">${'★'.repeat(Math.round(service.rating))} ${service.rating}</span>
        </div>
        

        <!-- Кнопки действий -->
        <div class="card-actions">
          <button class="btn-icon btn-favorite" data-id="${service.id}" title="Add to favorites">♡</button>
          <button class="btn-icon btn-cart" data-id="${service.id}" title="Add to cart">🛒</button>
        </div>
      </div>
    </article>
  `).join('');
  
  // Вешаем обработчики на кнопки избранного/корзины
  document.querySelectorAll('.btn-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => handleFavoriteClick(e, btn.dataset.id));
  });
  
  document.querySelectorAll('.btn-cart').forEach(btn => {
    btn.addEventListener('click', (e) => handleCartClick(e, btn.dataset.id));
  });
}

// === Пагинация ===
function renderPagination(total) {
  const totalPages = Math.ceil(total / state.itemsPerPage);
  
  if (totalPages <= 1) {
    elements.pagination.style.display = 'none';
    return;
  }
  
  elements.pagination.style.display = 'flex';
  elements.pageInfo.textContent = `Page ${state.currentPage} of ${totalPages}`;
  elements.prevBtn.disabled = state.currentPage === 1;
  elements.nextBtn.disabled = state.currentPage === totalPages;
}

// === Обработчики событий ===
function setupEventListeners() {
  // Поиск с дебаунсом (чтобы не спамить запросами)
  let searchTimeout;
  elements.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.filters.search = e.target.value;
      state.currentPage = 1; // Сбрасываем на первую страницу при новом поиске
      loadServices();
    }, 300);
  });
  
  // Сортировка
  elements.sortSelect.addEventListener('change', (e) => {
    const [sortBy, order] = e.target.value.split('-');
    state.filters.sortBy = sortBy === '' ? '' : sortBy;
    state.filters.order = order || 'asc';
    state.currentPage = 1;
    loadServices();
  });
  
  // Категория
  elements.categorySelect.addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    state.currentPage = 1;
    loadServices();
  });
  
  // Фильтр по цене
  const handlePriceFilter = () => {
    state.filters.minPrice = elements.minPriceInput.value || '';
    state.filters.maxPrice = elements.maxPriceInput.value || '';
    state.currentPage = 1;
    loadServices();
  };
  elements.minPriceInput.addEventListener('change', handlePriceFilter);
  elements.maxPriceInput.addEventListener('change', handlePriceFilter);
  
  // Пагинация
  elements.prevBtn.addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      loadServices();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  
  elements.nextBtn.addEventListener('click', () => {
    state.currentPage++;
    loadServices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// === Добавление в избранное ===
async function handleFavoriteClick(e, serviceId) {
  e.preventDefault();
  e.stopPropagation();
  
  try {
    await addToFavorites(serviceId);
    showNotification('Added to favorites! ✨');
    await updateHeaderCounts();
    
    // Визуально отмечаем кнопку
    const btn = e.currentTarget;
    btn.classList.add('active');
    btn.textContent = '♥';
  } catch (error) {
    showNotification('Failed to add to favorites', 'error');
  }
}

// === Добавление в корзину ===
async function handleCartClick(e, serviceId) {
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

// === Обновление счётчиков в шапке ===
async function updateHeaderCounts() {
  try {
    const { data: favorites } = await getFavorites();
    const { data: cart } = await getCart();
    
    elements.favoritesCount.textContent = favorites.length;
    elements.cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error('Failed to update counts:', error);
  }
}

// === Показ/скрытие лоадера ===
function showLoader(show) {
  if (show) {
    elements.cardsContainer.innerHTML = '<div class="loader">Loading services</div>';
  }
}

// === Запуск ===
document.addEventListener('DOMContentLoaded', init);