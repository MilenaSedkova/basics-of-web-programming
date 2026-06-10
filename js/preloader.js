document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    //ждем загрузки всех файлов!!!
    window.addEventListener('load', () => {

      // включаем анимацию исчезновения 
      preloader.classList.add('preloader--hidden');
      
      // удаляем прелоадер через 0, 5 сек
      setTimeout(() => {
        preloader.remove();
      }, 500);
    });
  }
});
