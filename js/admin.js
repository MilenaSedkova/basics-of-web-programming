import { requireAdmin } from './middleware/auth.js';
import { showNotification } from './api.js';

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
  filterService: document.getElementById('filterService')
};

async function init() {
  if (!requireAdmin()) return; // Проверка роли

  // Переключение вкладок
  UI.tabServices.addEventListener('click', () => switchTab('services'));
  UI.tabFeedback.addEventListener('click', () => switchTab('feedback'));

  // Логика Услуг
  await loadServices();
  UI.svcForm.addEventListener('input', validateServiceForm);
  UI.svcForm.addEventListener('submit', saveService);

  // Логика Отзывов
  await loadFeedback();
  UI.filterUser.addEventListener('input', loadFeedback);
  UI.filterService.addEventListener('input', loadFeedback);
}

function switchTab(tab) {
  UI.tabServices.classList.toggle('active', tab === 'services');
  UI.tabFeedback.classList.toggle('active', tab === 'feedback');
  UI.secServices.style.display = tab === 'services' ? 'block' : 'none';
  UI.secFeedback.style.display = tab === 'feedback' ? 'block' : 'none';
}

// === SERVICES (GET, POST, PUT, DELETE) ===
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
    name: document.getElementById('svcName').value.trim(),
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
  await loadServices();
}

window.deleteService = async (id) => {
  if(!confirm('Are you sure?')) return;
  await fetch(`http://localhost:3000/services/${id}`, { method: 'DELETE' });
  showNotification('Deleted');
  await loadServices();
};

window.editService = async (id) => {
  const res = await fetch(`http://localhost:3000/services/${id}`);
  const service = await res.json();
  document.getElementById('serviceId').value = service.id;
  document.getElementById('svcName').value = service.name;
  document.getElementById('svcPrice').value = service.price;
  validateServiceForm();
};

// === FEEDBACK ===
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