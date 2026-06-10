document.addEventListener('DOMContentLoaded', () => {
  const burgerIcon = document.querySelector('.burger-icon');
  const burgerMenu = document.querySelector('.burger-menu');
  const burgerOverlay = document.querySelector('.burger-overlay');
  
  if (!burgerIcon || !burgerMenu || !burgerOverlay) return;

  function toggleMenu() {
    burgerIcon.classList.toggle('active');
    burgerMenu.classList.toggle('active');
    burgerOverlay.classList.toggle('active');
    
    // Prevent scrolling when menu is open
    if (burgerMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMenu() {
    burgerIcon.classList.remove('active');
    burgerMenu.classList.remove('active');
    burgerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  burgerIcon.addEventListener('click', toggleMenu);
  burgerOverlay.addEventListener('click', closeMenu);

  // Close menu when clicking any link inside it
  const menuLinks = burgerMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
});
