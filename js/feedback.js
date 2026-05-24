import { getCurrentUser } from './middleware/auth.js';
import { showNotification } from './api.js';
import { showError, clearError } from './utils/formHelpers.js';

const elements = {
  form: document.getElementById('feedbackForm'),
  serviceSelect: document.getElementById('serviceSelect'),
  rating: document.getElementById('rating'),
  comment: document.getElementById('comment'),
  submitBtn: document.getElementById('submitFeedbackBtn')
};

let currentUser = null;

async function init() {
  currentUser = getCurrentUser();
  if (!currentUser) {
    showNotification('Please log in to leave feedback', 'error');
    return;
  }
  
  if (currentUser.role === 'admin') {
    elements.form.innerHTML = '<p class="error-message">Admins cannot leave feedback.</p>';
    return;
  }

  await loadPurchasedServices();

  elements.form.addEventListener('input', validateForm);
  elements.form.addEventListener('submit', handleSubmit);
}

async function loadPurchasedServices() {
  try {
    const res = await fetch(`http://localhost:3000/orders?userId=${currentUser.id}`);
    const orders = await res.json();
    
    // Получаем уникальные купленные услуги
    const purchased = new Map();
    orders.forEach(order => {
      order.items.forEach(item => purchased.set(item.serviceId, item.name));
    });

    elements.serviceSelect.innerHTML = '<option value="">-- Select a service --</option>';
    if (purchased.size === 0) {
      elements.serviceSelect.innerHTML = '<option value="">You haven\'t purchased anything yet</option>';
      return;
    }

    purchased.forEach((name, id) => {
      elements.serviceSelect.innerHTML += `<option value="${id}">${name}</option>`;
    });
  } catch (err) {
    showNotification('Failed to load purchases', 'error');
  }
}

function validateForm(e) {
  if (e && e.target) clearError(e.target);
  
  let isValid = true;
  
  if (!elements.serviceSelect.value) isValid = false;
  if (!elements.rating.value || elements.rating.value < 1 || elements.rating.value > 5) isValid = false;
  if (elements.comment.value.trim().length < 20) {
    if (e && e.target === elements.comment) showError(elements.comment, 'Minimum 20 characters required');
    isValid = false;
  }

  elements.submitBtn.disabled = !isValid;
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const feedbackData = {
    userId: currentUser.id,
    userNickname: currentUser.nickname,
    serviceId: elements.serviceSelect.value,
    rating: Number(elements.rating.value),
    comment: elements.comment.value.trim(),
    createdAt: new Date().toISOString()
  };

  try {
    await fetch('http://localhost:3000/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData)
    });
    showNotification('Feedback submitted successfully!');
    elements.form.reset();
    validateForm();
  } catch (err) {
    showNotification('Failed to submit feedback', 'error');
  }
}

document.addEventListener('DOMContentLoaded', init);