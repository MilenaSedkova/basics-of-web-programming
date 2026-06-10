/**
 * Проверяет, что текущий пользователь — администратор
 * @returns {boolean} true если доступ разрешён
 */
export function requireAdmin() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'admin') {
      // Перенаправляем на страницу ошибки, если не админ
      window.location.href = '403.html';
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    window.location.href = '403.html';
    return false;
  }
}

/**
 * Возвращает текущего пользователя или null
 * лезет в локальное хранилище браузера, достает оттуда строку currentUser и с помощью JSON.parse()
 * превращает ее обратно в удобный объект JavaScript(где лежат id, role, name и т.д.)
 * 
 * благодаря try catch Если в хранилище лежит какая-то битая строка, из-за которой скрипт
 *  мог бы упасть, функция просто тихо вернёт null
 */
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser'));
  } catch {
    return null;
  }
}

/**
 * Проверяет, авторизован ли пользователь вообще
 */
export function requireAuth() {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = 'login.html';
    return false;
  }
  
  return true;
}

/**
 * Обновляет видимость кнопки админки в шапке
 * 
 */
export function updateAdminButton() {
  const adminBtn = document.getElementById('adminPanelBtn');
  if (!adminBtn) return;
  
  const currentUser = getCurrentUser();
  adminBtn.style.display = currentUser?.role === 'admin' ? 'block' : 'none';
}