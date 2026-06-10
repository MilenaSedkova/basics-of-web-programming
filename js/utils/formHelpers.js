// показ/скрытие ошибок

//export делает элемент видимым для других файлов в проекте, чтобы забраьть такую функцию используем import
export function showError(inputElement, message) {
  // Находим или создаём контейнер для ошибки
  let errorElement = inputElement.nextElementSibling; //смторим на соседа справа или снизу в html относительно нашего поля ввода
  
  // после || - сосед не является элементом с классом erroe-message, скрип создаем его сам
  if (!errorElement || !errorElement.classList.contains('error-message')) {
    errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    //Она находит родительский контейнер поля и насильно вставляет
    //  туда наш новый <span> строго после поля ввода.
    inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
  }
  
  errorElement.textContent = message; //записывает в созданный тег текст ошибки
  inputElement.classList.add('invalid'); //вешает на инпут класс invalid, чтобы через CSS перекрасить
  //  его рамку в красный цвет.
  inputElement.setAttribute('aria-invalid', 'true'); //говорит экранным дикторам (для слепых пользователей), что поле заполнено неверно.
}

export function clearError(inputElement) {
  const errorElement = inputElement.nextElementSibling; //скрипт снова находит соседа справа/снизу от инпута.
  

  //если этот сосед существует и это действительно тег ошибки...
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.remove(); //встроенный метод, который навсегда удаляет тег ошибки из 
    // HTML-структуры страницы. 
  }
  
  inputElement.classList.remove('invalid'); //удаляет красный класс, возвращая рамке поля её обычный цвет.
  inputElement.setAttribute('aria-invalid', 'false'); //сообщает экранным дикторам, что теперь с полем всё в порядке.
}

export function markFieldRequired(inputElement) {
  const label = inputElement.previousElementSibling; //соседа слева (или сверху). Обычно в формах перед инпутом 
  // как раз и идёт тег <label>.

  //проверяем, нашли ли мы соседа и действительно ли этот сосед является тегом заголовка.
  if (label && label.tagName === 'LABEL') {

    //проверяем, не добавили ли мы звездочку ранее, если нет, то дописываем код
    if (!label.innerHTML.includes('<span class="required">*</span>')) {
      label.innerHTML += ' <span class="required">*</span>';
    }
  }
}