import { 
  validateBelarusPhone, formatPhone, validateEmail, validateAge, validatePassword 
} from './utils/validators.js';
import { showError, clearError, markFieldRequired } from './utils/formHelpers.js';
import { generateNickname, checkNicknameUnique } from './utils/nickNameGenerator.js';
import { showNotification } from './api.js';


//кэширование элементов
const form = document.getElementById('registerForm');
const fields = {
  phone: document.getElementById('phone'),
  email: document.getElementById('email'),
  dob: document.getElementById('dob'),
  password: document.getElementById('password'),
  confirmPassword: document.getElementById('confirmPassword'),
  firstName: document.getElementById('firstName'),
  lastName: document.getElementById('lastName'),
  middleName: document.getElementById('middleName'),
  nickname: document.getElementById('nickname'),
  agreement: document.getElementById('agreement'),
  autoPassword: document.getElementById('autoPassword'),
};
const registerBtn = document.getElementById('registerBtn');
const generateNickBtn = document.getElementById('generateNickBtn');

let nicknameAttempts = 0;

function init() {
  // Визуально помечаем обязательные поля

  //Встроенный метод Object.values(fields) берёт твой объект, 
  //полностью игнорирует текстовые ключи (phone, email), 
  //достаёт из него только значения (то есть живые HTML-инпуты) 
  //и упаковывает их в обычный чистый массив JavaScript.

  //Как только Object.values превратил элементы в массив, у нас появляется доступ к методу .forEach()
  Object.values(fields).forEach(field => {
    if (field && field.hasAttribute('required') && field.type !== 'checkbox') //не галочка
    {
      markFieldRequired(field); //помечаем поле обязательным
    }
  });

  document.querySelectorAll('.toggle-password-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Останавливаем всплытие, чтобы инпут не забирал фокус
      

      //Возьми кнопку, на которую только что кликнули, посмотри в её HTML-тег, 
      //найди там специальную метку с именем data-target и запиши её значение в переменную targetId».

      //this - текущий элемент, с которым мы сейчас работаем 
      const targetId = this.getAttribute('data-target');
      const passwordInput = document.getElementById(targetId);
      
      if (passwordInput) {
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          this.textContent = '\u{1F648}';
        } else {
          passwordInput.type = 'password';
          this.textContent = '\u{1F441}';
        }
      }
    });
  });

  // Запрет на вставку пароля в поле подтверждения
  fields.confirmPassword.addEventListener('paste', (e) => {
    e.preventDefault();
    showError(fields.confirmPassword, 'Вставка запрещена, введите пароль вручную');
  });

  // Форматирование телефона на лету
  fields.phone.addEventListener('input', (e) => {
    e.target.value = formatPhone(e.target.value);
    validateField(e.target);
  });

  // Убираем ошибки при вводе и валидируем
  form.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT') {
      clearError(e.target);
      validateField(e.target);
      checkFormValidity();
    }
  });

  // Автогенерация пароля (скрываем всю строку)
  fields.autoPassword.addEventListener('change', (e) => {
    const isAuto = e.target.checked; //target - элемент, с которым мы работали, cjecked - стоит ли галочка во 
    // внутрннем переключаетеле, ркз-татт true/false записывается в перменную IsAuto
    const passwordFieldsRow = document.getElementById('passwordFields');
    
    if (isAuto) {
      passwordFieldsRow.style.display = 'none';
      fields.password.value = 'AutoGen123!@';
      fields.confirmPassword.value = 'AutoGen123!@';
      fields.password.removeAttribute('required');
      fields.confirmPassword.removeAttribute('required');
      clearError(fields.password);
      clearError(fields.confirmPassword);
    } 
    //откат
    else {
      passwordFieldsRow.style.display = 'grid';
      fields.password.value = '';
      fields.confirmPassword.value = '';
      fields.password.setAttribute('required', true);
      fields.confirmPassword.setAttribute('required', true);
    }
    checkFormValidity();
  });

  generateNickBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const firstNameVal = fields.firstName.value.trim();
    const lastNameVal = fields.lastName.value.trim();
    
    if (!firstNameVal || !lastNameVal) {
      showError(fields.nickname, 'Сначала введите Имя и Фамилию');
      return;
    }
    
    let isUnique = false;
    let newNick = '';
    
    if (nicknameAttempts < 5) {
      newNick = generateNickname(firstNameVal, lastNameVal, nicknameAttempts);
      isUnique = await checkNicknameUnique(newNick);
      nicknameAttempts++;
      
      if (isUnique) {
        fields.nickname.value = newNick;
        fields.nickname.removeAttribute('readonly'); // Даем редактировать, раз уж он уникальный
        clearError(fields.nickname);
      } else {
        showError(fields.nickname, `Ник ${newNick} занят. Попробуйте ещё раз.`);
      }
      
      if (nicknameAttempts >= 5 && !isUnique) {
        showError(fields.nickname, 'Лимит попыток исчерпан. Введите никнейм вручную.');
        fields.nickname.removeAttribute('readonly');
        fields.nickname.value = '';
        fields.nickname.focus(); //ставиим курсор в поле 
      }
    } else {
      fields.nickname.removeAttribute('readonly');
      fields.nickname.focus();
    }
    checkFormValidity();
  });

  // Отправка формы
  form.addEventListener('submit', handleRegister);
}

function validateField(input) {
  const val = input.value.trim();
  
  if (input.hasAttribute('required') && !val && input.type !== 'checkbox') {
    showError(input, 'This field is required');
    return false;
  }

  switch(input.id) {
    case 'phone':
      if (!validateBelarusPhone(val)) { showError(input, 'Must be a valid Belarus number (+375...)'); return false; }
      break;
    case 'email':
      if (!validateEmail(val)) { showError(input, 'Invalid email format'); return false; }
      break;
    case 'dob':
      if (!validateAge(val)) { showError(input, 'You must be at least 16 years old'); return false; }
      break;
    case 'password':
      if (!fields.autoPassword.checked) {
        const passCheck = validatePassword(val, fields.confirmPassword.value);
        if (!passCheck.isValid) { showError(input, passCheck.errors[0]); return false; }
      }
      break;
    case 'confirmPassword':
       if (!fields.autoPassword.checked && val !== fields.password.value) {
         showError(input, 'Passwords do not match'); return false;
       }
       break;
  }
  return true;
}

function checkFormValidity() {

  //Если какого-то инпута нет на странице
  //field будет равен null. Команда return внутри .forEach просто досрочно завершает
  //текущий шаг цикла для этого поля и переходит к следующему, не ломая код.
  let isValid = true;

  //превращаем объект с данными в простой массив, чтобы перебрать через foreach
  Object.values(fields).forEach(field => {
    if (!field) return;
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) isValid = false;
    if (field.type !== 'checkbox' && field.hasAttribute('required') && !field.value) isValid = false;
    if (field.classList.contains('invalid')) isValid = false;
  });
  
  registerBtn.disabled = !isValid;
}

async function handleRegister(e) {
  e.preventDefault();
  
  const currentNick = fields.nickname.value.trim();
  if (!currentNick) {
    showError(fields.nickname, 'Никнейм обязателен');
    return;
  }

  const isUnique = await checkNicknameUnique(currentNick);
  if (!isUnique) {
     showError(fields.nickname, 'Nickname is already taken');
     return;
  }

  //соединеям данные, которые ввел пользователь
  const userData = {
    phone: fields.phone.value.replace(/\D/g, ''), //D стирает плюч и т.д.
    email: fields.email.value.trim(),
    dateOfBirth: fields.dob.value,
    password: fields.password.value,
    firstName: fields.firstName.value.trim(),
    lastName: fields.lastName.value.trim(),
    middleName: fields.middleName.value.trim(),
    nickname: currentNick,
    role: 'customer',
    agreementAccepted: fields.agreement.checked,
    createdAt: new Date().toISOString()
  };

  try {
    //отправка на сервер
    const res = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    //распаковываем ответ 
    const newUser = await res.json();
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    showNotification('Registration successful!');
    setTimeout(() => window.location.href = '../index.html', 1500);
  } catch (err) {
    showNotification('Registration failed', 'error');
  }
}

document.addEventListener('DOMContentLoaded', init);