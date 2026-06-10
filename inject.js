const fs = require('fs');
const path = require('path');

const files = [
  'html/catalog.html',
  'html/admin.html',
  'html/cart.html',
  'html/favorites.html',
  'html/login.html',
  'html/register.html',
  'html/feedback.html'
];

const faviconTag = '\n  <link rel="icon" type="image/svg+xml" href="../pictures/favicon.svg">';

const burgerIconHtml = `
      <div class="burger-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>`;

const burgerMenuHtml = `
  <div class="burger-overlay"></div>
  <div class="burger-menu">
    <div class="burger-menu-header">
      <img src="../pictures/logo.svg" alt="Moon Coach">
    </div>
    <ul class="burger-nav-links">
      <li><a href="../index.html#hero">Homepages</a></li>
      <li><a href="../index.html#about">About Pages</a></li>
      <li><a href="../index.html#others">Others</a></li>
      <li><a href="catalog.html">Catalog</a></li>
      <li class="burgerAdminPanelBtn" style="display: none;"><a href="admin.html" style="color: #8B7500; font-weight: 700;">Admin Panel</a></li>
      <li class="burgerAuthBlock"><a href="login.html">Log In</a></li>
      <li class="burgerFeedbackLinkBtn" style="display: none;"><a href="feedback.html">Leave Feedback</a></li>
    </ul>
  </div>
`;

files.forEach(file => {
  const p = path.join(__dirname, file);
  if (!fs.existsSync(p)) return;
  
  let content = fs.readFileSync(p, 'utf8');
  
  if (!content.includes('favicon.svg')) {
    content = content.replace('<title>', faviconTag + '\n  <title>');
  }
  
  if (!content.includes('burger-icon')) {
    content = content.replace('<div class="header-right">', burgerIconHtml + '\n\n      <div class="header-right">');
  }
  
  if (!content.includes('burger-menu')) {
    content = content.replace('<body>', '<body>\n' + burgerMenuHtml);
  }
  
  if (!content.includes('burger.js')) {
    content = content.replace('</body>', '  <script src="../js/burger.js"></script>\n</body>');
  }

  fs.writeFileSync(p, content, 'utf8');
});

console.log('Injection complete');
