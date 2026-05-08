// массив из 15 объектов ===
const services = [
  {
    id: 1,
    name: "Life Transformation",
    description: "Deep personal coaching to unlock your potential and create lasting change.",
    price: 149,
    rating: 4.9, /*number - дробное число*/
    category: "personal",
    image: "../pictures/pricing.jpg",
    duration: "12 weeks"
  },
  {
    id: 2,
    name: "Career Accelerator",
    description: "Strategic guidance for professionals ready to level up their career.",
    price: 199,
    rating: 4.8,
    category: "career",
    image: "../pictures/path-to-image3.png",
    duration: "8 weeks"
  },
  {
    id: 3,
    name: "Mindfulness Mastery",
    description: "Learn practical meditation and mindfulness techniques for daily stress relief.",
    price: 89,
    rating: 4.7,
    category: "wellness",
    image: "../pictures/testimonial.jpg",
    duration: "4 weeks"
  },
  {
    id: 4,
    name: "Group Power Session",
    description: "High-energy group coaching with accountability partners.",
    price: 59,
    rating: 4.6,
    category: "group",
    image: "../pictures/path-to-image1.png",
    duration: "6 weeks"
  },
  {
    id: 5,
    name: "Online Confidence Course",
    description: "Self-paced video course to build unshakeable self-confidence.",
    price: 79,
    rating: 4.5,
    category: "online",
    image: "../pictures/path-to-image2.png",
    duration: "Self-paced"
  },
  {
    id: 6,
    name: "Relationship Harmony",
    description: "Coaching for couples and individuals to build healthier relationships.",
    price: 169,
    rating: 4.9,
    category: "personal",
    image: "../pictures/path-to-image3.png",
    duration: "10 weeks"
  },
  {
    id: 7,
    name: "Wellness Reset",
    description: "Holistic program combining nutrition, movement, and mindset.",
    price: 129,
    rating: 4.7,
    category: "wellness",
    image: "../pictures/path-to-about1.png",
    duration: "6 weeks"
  },
  {
    id: 8,
    name: "Leadership Launch",
    description: "Develop executive presence and leadership skills for emerging managers.",
    price: 219,
    rating: 4.8,
    category: "career",
    image: "../pictures/path-to-about2.png",
    duration: "12 weeks"
  },
  {
    id: 9,
    name: "Stress-Free Living",
    description: "Practical tools and strategies to manage stress and create calm.",
    price: 99,
    rating: 4.6,
    category: "wellness",
    image: "../pictures/path-to-about3.png",
    duration: "4 weeks"
  },
  {
    id: 10,
    name: "Team Synergy Workshop",
    description: "Interactive group session to improve communication in teams.",
    price: 299,
    rating: 4.9,
    category: "group",
    image: "../pictures/path-to-blog1.png",
    duration: "1 day"
  },
  {
    id: 11,
    name: "Digital Detox Program",
    description: "Reclaim your time and focus with healthy tech habits.",
    price: 69,
    rating: 4.4,
    category: "online",
    image: "../pictures/path-to-blog2.png",
    duration: "21 days"
  },
  {
    id: 12,
    name: "Purpose Discovery",
    description: "Clarify your values, vision, and mission to live with intention.",
    price: 139,
    rating: 4.8,
    category: "personal",
    image: "../pictures/path-to-blog3.png",
    duration: "8 weeks"
  },
  {
    id: 13,
    name: "Public Speaking Pro",
    description: "Overcome fear and master the art of compelling presentations.",
    price: 159,
    rating: 4.7,
    category: "career",
    image: "../pictures/path-to-others1.png",
    duration: "6 weeks"
  },
  {
    id: 14,
    name: "Sleep & Recovery",
    description: "Science-backed strategies to improve sleep quality and energy.",
    price: 79,
    rating: 4.5,
    category: "wellness",
    image: "../pictures/path-to-others2.png",
    duration: "4 weeks"
  },
  {
    id: 15,
    name: "Mastermind Circle",
    description: "Exclusive small-group coaching with peer support.",
    price: 349,
    rating: 5.0,
    category: "group",
    image: "../pictures/path-to-others3.png",
    duration: "3 months"
  }
];

// глобальные переменные, связывают javaScript с HTML, без них скрипт бы не знал, куда вставлять карточки и  ===
let currentServices = [...services]; /*let - переменная, которую можно менять позже, currentSErvice -имя переменной, = присваивание,  [...services] - создает поверхностную копию массива ... - spread-оператор*/
const cardsContainer = document.getElementById('cardsContainer'); /*document -  интерактивная модель моей страницы, котрую бразуре создал в своей памяти после того, как прочитал твой HTML-файл, getElementById - метод, cardsContainer - аргумент, который передаем*/
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const categorySelect = document.getElementById('categorySelect');
const methodsGrid = document.getElementById('methodsGrid');

// этап 2: 10 методов массивов 
const arrayMethods = [ /*массив, хранящий конфгурацию кнопок*/
  {   /* {} - создаем объект(струткру данных, которая создает струутуру данных ключ-значение) */
    /*объект с 2 свойствами, name - текст на кнопке, method - функция, которая выполнится при клике */
    name: "filter (price < 100)", 
    method: () => services.filter(s => s.price < 100) /*создает новый массив, и возвращает его */
  }, /* это разделитель, создали 1 обект теперь следующий */
  { 
    name: "map (add discount)",/*map преобразует каждый элемент и возвращает новый массив той же длины, map не меняет оригальные объекты, а создает новые */
    method: () => services.map(s => ({...s, discountedPrice: Math.round(s.price * 0.9)})) /*...s создаем копию элемента s и добавляем новое поле discountedPrice. Math.Round - считает цену со скдикой 10% и этот метод округляет число до ближайшего целого*/
  },
  { 
    name: "sort (by rating)", 
    method: () => [...services].sort((a, b) => b.rating - a.rating) /*method - имя свойства в объекте, мы назвали его так, () - параметры, этот метод не принимает никаких параметров, => слева парметры, справа - тело фцнкции, service.filter - то, что функция вернет при вызове, результат нажатия, => вместо return*/
  },
  { 
    name: "filter + sort", 
    method: () => services.filter(s => s.category === 'personal').sort((a, b) => a.price - b.price)
  },
  { 
    name: "reduce (avg price)", 
    method: () => {
      const avg = services.reduce((sum, s) => sum + s.price, 0) / services.length;
      return services.filter(s => s.price <= avg);
    }
  },
  { 
    name: "find (best rated)", 
    method: () => {
      const best = services.reduce((max, s) => s.rating > max.rating ? s : max);
      return [best];
    }
  },
  { 
    name: "some (has 5 stars)", 
    method: () => services.some(s => s.rating === 5.0) ? services.filter(s => s.rating === 5.0) : []
  },
  { 
    name: "every (check online)", 
    method: () => services.every(s => s.category !== 'online') ? services.slice(0, 3) : services.filter(s => s.category === 'online')
  },
  { 
    name: "slice (first 5)", 
    method: () => services.slice(0, 5)
  },
  { 
    name: "includes (wellness)", 
    method: () => services.filter(s => s.description.toLowerCase().includes('wellness'))
  }
];

// функция отрисовки карточек ===
function renderCards(data, showDiscount = false) {
  cardsContainer.innerHTML = '';
  
  if (data.length === 0) {
    noResults.style.display = 'block';
    cardsContainer.style.display = 'none';
    return;
  }
  
  noResults.style.display = 'none';
  cardsContainer.style.display = 'grid';
  
  data.forEach(service => {
    const card = document.createElement('article');
    card.className = 'service-card';
    
    const priceDisplay = showDiscount && service.discountedPrice 
      ? `<span style="text-decoration: line-through; color: #999; margin-right: 8px;">$${service.price}</span>$${service.discountedPrice}`
      : `$${service.price}`;
    
    const stars = '★'.repeat(Math.round(service.rating));
    
    card.innerHTML = `
      <img src="${service.image}" alt="${service.name}" class="card-image" onerror="this.src='https://via.placeholder.com/400x300/E4E2D3/333?text=${encodeURIComponent(service.name)}'">
      <div class="card-content">
        <span class="card-category">${service.category}</span>
        <h3 class="card-title">${service.name}</h3>
        <p class="card-description">${service.description}</p>
        <div class="card-meta">
          <span class="card-price">${priceDisplay}</span>
          <span class="card-rating">${stars} ${service.rating}</span>
        </div>
      </div>
    `;
    
    cardsContainer.appendChild(card);
  });
}

// фильтрация и сортировка (Этап 3) ===
function applyFilters() {
  let result = [...services];
  
  const searchTerm = searchInput.value.toLowerCase().trim();
   /*если поле не пустое, запускаем поиск*/
 if (searchTerm) {
    result = result.filter(s =>  /*создаем ноывй массив только с подходящими элементами*/
      s.name.toLowerCase().includes(searchTerm) ||  /*проверяет, содержится ли поисковой запрос в названии услуги*/
      s.description.toLowerCase().includes(searchTerm) /*проверяет описание на наличие запроса*/
    );
  }
  
  const category = categorySelect.value;
  if (category !== 'all') {
    result = result.filter(s => s.category === category);
  }
  
  const sortBy = sortSelect.value;
  switch(sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'rating-desc':
      result.sort((a, b) => b.rating - a.rating);
      break;
  }
  
  renderCards(result);
}

// генерация кнопок методов ===
function renderMethodButtons() {
  arrayMethods.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'method-btn';
    btn.textContent = item.name;
    btn.title = item.method.toString();
    
    btn.addEventListener('click', () => {
      document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const result = item.method();
      const showDiscount = item.name.includes('discount');
      renderCards(result, showDiscount);
    });
    
    methodsGrid.appendChild(btn);
  });
  
  // кнопка сброса
  const resetBtn = document.createElement('button');
  resetBtn.className = 'method-btn';
  resetBtn.textContent = '⟲ Reset';
  resetBtn.style.background = '#666';
  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
    searchInput.value = '';
    sortSelect.value = 'default';
    categorySelect.value = 'all';
    renderCards(services);
  });
  methodsGrid.appendChild(resetBtn);
}

// инициализация ===
function init() {
  renderCards(services);
  renderMethodButtons();
  
  searchInput.addEventListener('input', applyFilters);
  sortSelect.addEventListener('change', applyFilters);
  categorySelect.addEventListener('change', applyFilters);
}

document.addEventListener('DOMContentLoaded', init);