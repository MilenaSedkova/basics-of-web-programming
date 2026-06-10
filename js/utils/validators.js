// Валидация номера телефона РБ
export function validateBelarusPhone(phone) {
  const digits = phone.replace(/\D/g, ''); //D означает «всё, что НЕ является цифрой», скрипт стирает это, оставляя только цифры 
  const phoneRegex = /^375(25|29|33|44)\d{7}$/; // d - ровно 7 цифр в конце
  return phoneRegex.test(digits);
}

// Форматирование телефона на лету
export function formatPhone(input) {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('375')) {
    digits = digits.slice(3); //врменно обрезаем 375, чтобы не мешало
  }
  if (digits.length > 9) {
    digits = digits.slice(0, 9); //ограничиваем длину до 9
  }
  if (digits.length === 0) return '';

  const code = digits.slice(0, 2);
  let formatted = `+375 (${code}`;
  //пошагово режем маску
  if (digits.length > 2) formatted += `) ${digits.slice(2, 5)}`;
  if (digits.length > 5) formatted += `-${digits.slice(5, 7)}`;
  if (digits.length > 7) formatted += `-${digits.slice(7, 9)}`;
  
  return formatted;
}

// Валидация email
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // вначале идёт любой текст без пробелов и символа @
  //@ — обязательное наличие одной «собачки».
  //\.[^\s@]+$ — обязательное наличие точки, после которой идёт домен (например, com или by).
  return emailRegex.test(email);
}

// Валидация возраста (16+)
//Скрипт вычитает года, а затем проверяет: если текущий месяц меньше месяца рождения 
// (или месяцы совпали, но текущий день меньше дня рождения), то он делает 
// age-- (откатывает возраст на один год назад). В конце функция проверяет, 
// есть ли пользователю 16 лет, и возвращает true или false.
export function validateAge(dateOfBirth) {
  if (!dateOfBirth) return false;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 16;
}

const TOP_100_PASSWORDS = [
  '123456', 'password', '123456789', '12345', '1234',
  '111111', '12345678', 'abc123', 'password1', '123123'
];

// Валидация пароля
export function validatePassword(password, confirmPassword = null) {
  const errors = [];
  
  if (password.length < 8) errors.push('Минимум 8 символов');
  if (password.length > 20) errors.push('Не более 20 символов');
  if (!/[A-ZА-Я]/.test(password)) errors.push('Хотя бы одна заглавная буква');
  if (!/[a-zа-я]/.test(password)) errors.push('Хотя бы одна строчная буква');
  if (!/\d/.test(password)) errors.push('Хотя бы одна цифра');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('Хотя бы один спецсимвол');
  
  if (TOP_100_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Пароль слишком распространён');
  }
  
  return {
    isValid: errors.length === 0, // true, если массив ошибок окажется пустым
    errors //список ошибок 
  };
}
