/**
 * API слой для работы с JSON Server
 * Все запросы идут на сервер — фильтрация/сортировка на бэкенде!
 */

//базовый адрес сервера

const API_BASE = 'http://localhost:3000';

/**
 * Универсальная функция для fetch-запросов, собирает URL, добавляет параметры, делает fetch, обрабатывает ошибки и пагинацию
 */
async function apiRequest(endpoint, params = {}) {
  const url = new URL(`${API_BASE}${endpoint}`);
  
  // Добавляем параметры запроса в URL, берем объект и возвращаем массив, где каждый элемент - это ключ, значение
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value); //serachItem - интерфейс для работы с параметрами запроса, append добавляет пару key=value в конец списка апаремтров
    }
  });
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    // JSON Server возвращает данные + заголовки пагинации
    const data = await response.json();
    const total = response.headers.get('X-Total-Count');
    
    return {
      data: Array.isArray(data) ? data : [data],
      total: total ? parseInt(total) : null
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// === SERVICES ===

/**
 * Получить услуги с фильтрацией, сортировкой и пагинацией
 * ВСЕ параметры уходят на сервер!
 */
export async function getServices({
  page = 1,
  limit = 6,
  search = '',
  category = '',
  sortBy = '',
  order = 'asc',
  minPrice = '',
  maxPrice = ''
} = {}) {
  const params = {
    _page: page,
    _limit: limit,
    q: search || undefined,  // JSON Server ищет по всем текстовым полям
    category: category || undefined,
    _sort: sortBy || undefined,
    _order: order,
    price_gte: minPrice || undefined,
    price_lte: maxPrice || undefined
  };
  
  return await apiRequest('/services', params);
}

/**
 * Получить одну услугу по ID
 */
export async function getServiceById(id) {
  const { data } = await apiRequest(`/services/${id}`);
  return data[0];
}

// === FAVORITES ===

/**
 * Получить список избранного
 */


//export делает функция доступной для других файлов
export async function getFavorites() {
    //Делегирует всю сложную работу универсальной функции apiRequest
  return await apiRequest('/favorites');
}

/**
 * Добавить в избранное
 */
export async function addToFavorites(serviceId) {
  // Проверяем, нет ли уже в избранном
  const { data: existing } = await apiRequest(`/favorites?serviceId=${serviceId}`);
  if (existing.length > 0) return existing[0];
  
  const response = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceId, addedAt: new Date().toISOString() })
  });
  return await response.json();
}

/**
 * Удалить из избранного
 */
export async function removeFromFavorites(id) {
  await fetch(`${API_BASE}/favorites/${id}`, { method: 'DELETE' });
}

/**
 * Получить полные данные услуг из избранного
 */
export async function getFavoritesWithDetails() {
  const { data: favorites } = await getFavorites();
  const services = await Promise.all(
    favorites.map(fav => getServiceById(fav.serviceId))
  );
  return services.filter(s => s); // убираем undefined
}

// корзина

/**
 * Получить корзину
 */
export async function getCart() {
  return await apiRequest('/cart');
}

/**
 * Добавить в корзину (или увеличить количество)
 */
export async function addToCart(serviceId, quantity = 1) {
  const { data: existing } = await apiRequest(`/cart?serviceId=${serviceId}`);
  
  if (existing.length > 0) {
    // Обновляем количество
    const item = existing[0];
    const response = await fetch(`${API_BASE}/cart/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: item.quantity + quantity })
    });
    return await response.json();
  } else {
    // Создаём новую запись
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        serviceId, 
        quantity,
        addedAt: new Date().toISOString()
      })
    });
    return await response.json();
  }
}

/**
 * Удалить из корзины
 */
export async function removeFromCart(id) {
  await fetch(`${API_BASE}/cart/${id}`, { method: 'DELETE' });
}

/**
 * Обновить количество в корзине
 */
export async function updateCartQuantity(id, quantity) {
  if (quantity <= 0) {
    await removeFromCart(id);
    return;
  }
  await fetch(`${API_BASE}/cart/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });
}

/**
 * Очистить корзину (после покупки)
 */
export async function clearCart() {
  const { data: items } = await getCart();
  await Promise.all(items.map(item => 
    fetch(`${API_BASE}/cart/${item.id}`, { method: 'DELETE' })
  ));
}

/**
 * Получить полные данные услуг из корзины с количествами
 */
export async function getCartWithDetails() {
  const { data: cartItems } = await getCart();
  const items = await Promise.all( //запускаем несколько асинхронных операций одновременно и ждем, пока они все заверщаться
    cartItems.map(async item => {
      const service = await getServiceById(item.serviceId);
      return service ? { ...service, cartQuantity: item.quantity, cartId: item.id } : null;
    })
  );
  return items.filter(i => i);
}

/**
 * Рассчитать общую стоимость корзины
 */
export async function getCartTotal() {
  const items = await getCartWithDetails();
  return items.reduce((total, item) => total + item.price * item.cartQuantity, 0);
}

// утиллиты

/**
 * Получить уникальные категории
 */
export async function getCategories() {
  const { data } = await getServices({ limit: 100 }); // берём много, чтобы охватить все
  const categories = new Set(data.map(s => s.category).filter(Boolean)); // коллекция set автоматически удаляет дубликаты
  return Array.from(categories);  // возвращаем set в обычный массив
}

/**
 * Показать уведомление пользователю
 */
export function showNotification(message, type = 'success') {
  // Удаляем старое уведомление если есть
  const old = document.querySelector('.notification');
  if (old) old.remove();
  
  const notification = document.createElement('div'); //создаем элемент div в оперативной памяти и сохраням ссылку на этот элемент
  notification.className = `notification notification--${type}`;
  //наполняем внутренним html
  notification.innerHTML = `
    <span class="notification__message">${message}</span>
    <button class="notification__close">&times;</button>
  `;
  
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    background: type === 'success' ? '#4CAF50' : '#f44336',
    color: '#fff',
    borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: '1000',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    animation: 'slideIn 0.3s ease'
  });
  
  //notification.querySelector - находит кнопку закрытия внутри уведомления
  notification.querySelector('.notification__close').onclick = () => notification.remove();
  document.body.appendChild(notification);
  
  // Авто-скрытие через 3 секунды
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => notification.remove(), 300); // удаляем через 0.3 секунды
  }, 3000);
}

// Анимация для уведомления
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);