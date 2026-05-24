// показ/скрытие ошибок

export function showError(inputElement, message) {
  // Находим или создаём контейнер для ошибки
  let errorElement = inputElement.nextElementSibling;
  
  if (!errorElement || !errorElement.classList.contains('error-message')) {
    errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
  }
  
  errorElement.textContent = message;
  inputElement.classList.add('invalid');
  inputElement.setAttribute('aria-invalid', 'true');
}

export function clearError(inputElement) {
  const errorElement = inputElement.nextElementSibling;
  
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.remove();
  }
  
  inputElement.classList.remove('invalid');
  inputElement.setAttribute('aria-invalid', 'false');
}

export function markFieldRequired(inputElement) {
  const label = inputElement.previousElementSibling;
  if (label && label.tagName === 'LABEL') {
    if (!label.innerHTML.includes('<span class="required">*</span>')) {
      label.innerHTML += ' <span class="required">*</span>';
    }
  }
}