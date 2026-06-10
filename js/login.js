import { validateEmail } from './utils/validators.js';
import { showError, clearError, markFieldRequired } from './utils/formHelpers.js';
import { showNotification } from './api.js';

const form = document.getElementById('loginForm');
const emailInput = document.getElementById('loginEmail');
const passwordInput = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');

function init() {
  markFieldRequired(emailInput);
  markFieldRequired(passwordInput);

  // Логика показа/скрытия пароля (глаз)
  //querySelectorAll — находит вообще все кнопки с таким классом на странице
  document.querySelectorAll('.toggle-password-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      //e.preventDefault(); — отменяет стандартное поведение браузера. 
      // Если эта кнопка случайно оказалась внутри формы <form>, 
      // браузер может подумать, что её нажали для отправки данных, и перезагрузит страницу.
      //  Эта строчка блокирует такое.

      e.preventDefault();

      
      //e.stopPropagation()-
      //Она запрещает клику подниматься выше к родительским элементам. 
      //Клик остаётся строго внутри кнопки и не тревожит остальные обработчики на форме.
      e.stopPropagation();

      //скрипт смотрит на саму кнопку (за неё отвечает слово this) и читает 
      //значение её специального атрибута data-target.
      const targetId = this.getAttribute('data-target');

      //JavaScript берёт считанный ID и находит на странице то самое поле ввода пароля, 
      // с которым кнопка связана.
      const input = document.getElementById(targetId);
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          this.textContent = '\u{1F648}';
        } else {
          input.type = 'password';
          this.textContent = '\u{1F441}';
        }
      }
    });
  });

  // Валидация при вводе
  form.addEventListener('input', () => {
    clearError(emailInput);
    clearError(passwordInput);
    
    let isValid = true;
    
    if (!validateEmail(emailInput.value.trim())) {
      isValid = false;
    }
    if (passwordInput.value.trim().length === 0) {
      isValid = false;
    }
    
    loginBtn.disabled = !isValid;
  });

  form.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    // Ищем пользователя на сервере с таким email и паролем
    const response = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
    const users = await response.json();

    if (users.length === 0) {
      // Если сервер вернул пустой массив, значит данные неверны
      showError(emailInput, 'Неверный Email или пароль');
      showError(passwordInput, 'Неверный Email или пароль');
      showNotification('Login failed. Check credentials.', 'error');
      return;
    }

    // Если пользователь найден, берем его данные
    const user = users[0];
    
    // Сохраняем сессию в память браузера
    localStorage.setItem('currentUser', JSON.stringify(user));
    showNotification(`Welcome back, ${user.nickname || user.firstName}! ✨`);

    // Перенаправляем в зависимости от роли(пауза в полторы секунды)
    setTimeout(() => {
      if (user.role === 'admin') {
        window.location.href = 'admin.html'; // Админа сразу ведем в панель
      } else {
        window.location.href = 'catalog.html'; // Обычного клиента — в каталог
      }
    }, 1500);

  } catch (error) {
    console.error('Login error:', error);
    showNotification('Server error. Try again later.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', init);