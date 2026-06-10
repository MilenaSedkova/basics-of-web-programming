import { requireAdmin } from './middleware/auth.js';
import { showNotification } from './api.js';


//Чтобы не засорять код бесконечными вызовами document.getElementById внутри функций. 
//Теперь все кнопки, таблицы и инпуты лежат в одном структурированном месте. 
//Нужен инпут формы? Просто пишешь UI.svcForm.
const UI = {
  tabServices: document.getElementById('tabServices'),
  tabFeedback: document.getElementById('tabFeedback'),
  secServices: document.getElementById('sectionServices'),
  secFeedback: document.getElementById('sectionFeedback'),
  
  svcForm: document.getElementById('serviceForm'),
  saveBtn: document.getElementById('saveServiceBtn'),
  svcTable: document.getElementById('servicesTableBody'),
  
  fbTable: document.getElementById('feedbackTableBody'),
  filterUser: document.getElementById('filterUser'),
  filterService: document.getElementById('filterService'),
  
  serviceModal: document.getElementById('serviceModal'),
  deleteModal: document.getElementById('deleteModal'),
  addBtn: document.getElementById('addServiceBtn'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
  cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
  modalTitle: document.getElementById('modalTitle')
};

let itemToDelete = null;

async function init() {
  if (!requireAdmin()) return; // Проверка роли

  // Переключение вкладок
  //Функция switchTab(tab) управляет отображением разделов.
  //  Вместо загрузки новых страниц она использует тернарный оператор 
  // и просто меняет CSS-свойство display: для активной вкладки ставит 'block'
  // , для скрытой — 'none'.
  UI.tabServices.addEventListener('click', () => switchTab('services'));
  UI.tabFeedback.addEventListener('click', () => switchTab('feedback'));

  // Логика Услуг
  await loadServices();
  UI.svcForm.addEventListener('input', validateServiceForm);
  UI.svcForm.addEventListener('submit', saveService);

  // Modals Event Listeners
  UI.addBtn.addEventListener('click', () => {
    UI.svcForm.reset();
    document.getElementById('serviceId').value = '';
    UI.modalTitle.textContent = 'Add Service';
    validateServiceForm();
    UI.serviceModal.style.display = 'flex';
  });

  UI.closeModalBtn.addEventListener('click', () => {
    UI.serviceModal.style.display = 'none';
  });

  UI.cancelDeleteBtn.addEventListener('click', () => {
    UI.deleteModal.style.display = 'none';
    itemToDelete = null;
  });

  UI.confirmDeleteBtn.addEventListener('click', async () => {
    if (itemToDelete) {
      await fetch(`http://localhost:3000/services/${itemToDelete}`, { method: 'DELETE' });
      showNotification('Deleted');
      await loadServices();
      UI.deleteModal.style.display = 'none';
      itemToDelete = null;
    }
  });

  // Логика Отзывов
  await loadFeedback();
  UI.filterUser.addEventListener('input', loadFeedback);
  UI.filterService.addEventListener('input', loadFeedback);
}

function switchTab(tab) {

  // UI.tabServices. мы берём из нашего чемоданчика элементов конкретную кнопку вкладки «Услуги».
  //.classList — открываем список CSS-классов этой кнопки.
  //.toggle( ... ) — запускаем функцию переключения.
  //'active' — это класс, которым мы управляем. В твоём CSS-файле этот класс, 
  // скорее всего, меняет цвет фона кнопки или текста (например, делает её яркой, показывая, 
  // что вкладка активна).
  //tab === 'services' — это условие (второй параметр). 
  // Компьютер сначала вычисляет его результат. Если в переменной tab сейчас лежит слово 'services',
  // то это условие превращается в true. Если там лежит любое другое слово (например, 'feedback'),
  // условие превращается в false.
  UI.tabServices.classList.toggle('active', tab === 'services'); //проверить, есть ли у тега указанный CSS-класс.
  //  Если класса нет — он его добавляет, а если класс уже есть — он его удаляет.
  UI.tabFeedback.classList.toggle('active', tab === 'feedback');
  UI.secServices.style.display = tab === 'services' ? 'block' : 'none';
  UI.secFeedback.style.display = tab === 'feedback' ? 'block' : 'none';
}

// === SERVICES (GET, POST, PUT, DELETE) ===
//Делает обычный GET-запрос к серверу, забирает массив услуг и через метод .map()
//лепит из них строчки таблицы <tr>.
async function loadServices() {
  const res = await fetch('http://localhost:3000/services');
  const services = await res.json();
  UI.svcTable.innerHTML = services.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>$${s.price}</td>
      <td>
        <button onclick="window.editService('${s.id}')">Edit</button>
        <button onclick="window.deleteService('${s.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function validateServiceForm() {
  const name = document.getElementById('svcName').value.trim();
  const price = document.getElementById('svcPrice').value;
  UI.saveBtn.disabled = !(name.length > 0 && price > 0);
}

async function saveService(e) {
  e.preventDefault();
  const id = document.getElementById('serviceId').value;
  const data = {
    name: document.getElementById('svcName').value.trim(), //удаляет все пробелы, табы и переносы строк в самом начале и в самом конце строки.
    price: Number(document.getElementById('svcPrice').value)
  };

  const method = id ? 'PATCH' : 'POST';
  const url = id ? `http://localhost:3000/services/${id}` : 'http://localhost:3000/services';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  showNotification('Service saved');
  UI.svcForm.reset();
  document.getElementById('serviceId').value = '';
  validateServiceForm();
  UI.serviceModal.style.display = 'none';
  await loadServices();
}

window.deleteService = (id) => {
  itemToDelete = id;
  UI.deleteModal.style.display = 'flex';
};

window.editService = async (id) => {
  const res = await fetch(`http://localhost:3000/services/${id}`);
  const service = await res.json();
  document.getElementById('serviceId').value = service.id;
  document.getElementById('svcName').value = service.name;
  document.getElementById('svcPrice').value = service.price;
  UI.modalTitle.textContent = 'Edit Service';
  validateServiceForm();
  UI.serviceModal.style.display = 'flex';
};

//Живой поиск: Скрипт следит за вводом в поля фильтра (filterUser и filterService). 
// Как только ты вводишь туда буквы, мгновенно вызывается loadFeedback.

//Приставка _like — это встроенная фича твоего json-server.
//Она позволяет искать не по точному совпадению, а по частичному. 
//Наберешь в фильтре "iva", и сервер послушно выдаст всех пользователей,
//у которых в никнейме есть эти буквы (например, ivan_99).
async function loadFeedback() {
  const user = UI.filterUser.value.trim();
  const svc = UI.filterService.value.trim();
  
  let query = 'http://localhost:3000/feedback?';
  if (user) query += `userNickname_like=${user}&`;
  if (svc) query += `serviceId=${svc}&`;

  const res = await fetch(query);
  const feedbacks = await res.json();
  
  UI.fbTable.innerHTML = feedbacks.map(f => `
    <tr>
      <td>${f.id}</td>
      <td>${f.userNickname}</td>
      <td>${f.serviceId}</td>
      <td>${f.rating}/5</td>
      <td>${f.comment.substring(0, 30)}...</td>
      <td><button onclick="window.deleteFeedback('${f.id}')">Delete</button></td>
    </tr>
  `).join('');
}

window.deleteFeedback = async (id) => {
  if(!confirm('Delete this feedback?')) return;
  await fetch(`http://localhost:3000/feedback/${id}`, { method: 'DELETE' });
  showNotification('Feedback deleted');
  await loadFeedback();
};

document.addEventListener('DOMContentLoaded', init);