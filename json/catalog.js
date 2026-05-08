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
    rating: 5,
    category: "online",
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
    /*если result <0, a остается левее, если a > 0, b идет левее(меняется местами) */
  },
  { 
    name: "filter + sort", /*сначала оставляем только услуги personal, потом сортируем результат по цене(от дешевых к дорогим) */
    method: () => services.filter(s => s.category === 'personal').sort((a, b) => a.price - b.price)
  },
  { 
    name: "reduce (avg price)", 
    method: () => {
      const avg = services.reduce((sum, s) => sum + s.price, 0) / services.length; /* reduce сводит массив к 1 итоговому значению, суммирует все цены */
      /*,0 - начинаем с нуля, добавляем s.price - (текущая сумма и накопленную(sum) */
      /*services.length - делим на всю длину массива*/
      return services.filter(s => s.price <= avg); /*возвращаем те карочки, цена которых меньше или равна срденей*/
    }
  },
  { 
    name: "find (best rated)", 
    method: () => {
      const best = services.reduce((max, s) => s.rating > max.rating ? s : max);
      /* reduce(max, s) проходит по всем услугам, сравнивает рейтинг с текущим максимумом */
      /*s.ratung > max.rating ? s: max  - если рейтинг текущей услуги больше, чем текущий макисмум, делаем ее максимумом*/
      // s : max - если условие верно, то возвращается левая часть, если нет - правая 
      return [best]; /*возвращаем массив из 1 эдемента*/
    }
  },
  { 
    // some проверяет, существует ли хотя бы 1 экземпляр, соответствующий функции, заданной в коллбэке
    name: "some (has 5 stars)", 
    method: () => services.some(s => s.rating === 5.0) ? services.filter(s => s.rating === 5.0) : []
    // === - строгое равенство без приведения типов, например 5 === "5" - false
  },
  { 
    // every проверяет, удовлетворяют ли все элементы в массиве заданному условию
    name: "every (check online)",  
    // slice создает новый массив или строку, содержащую часть копии части строки или массива, не изменяя оригинал
    method: () => services.every(s => s.category !== 'online') ? services.slice(0, 3) : services.filter(s => s.category === 'online')
    // slice(0, 3) - начинаем с 0, заканчиваем на 3 индексе(не включительно)
  
  },

  { 
    // slice создает новый массив, содержащий часть копии части массива, не изменяя оригинал
    name: "slice (first 5)", 
    method: () => services.slice(0, 5)
  },  
  { 
    // includes - проверка наличия элемента в строке или массива
    name: "includes (stress)", 
    method: () => services.filter(s => s.description.toLowerCase().includes('stress'))
  }
];

// функция отрисовки карточек
// showDiscount = false - если не передать при вызове метода, скидки не будет
function renderCards(data, showDiscount = false) {
 /* cardsConteiner - ссылки на div id = cardsConteiner*/ cardsContainer.innerHTML = ''; //удаляем все содержимое5 внутри, чтобы при новой отрисовке карточки не дублировалист
  
  if (data.length === 0) {
    noResults.style.display = 'block'; //показывает блок "ничего не найдено", block - отображаем элемент как блочный, это свойство css
    cardsContainer.style.display = 'none'; //скрываем сетку карточек, ничего не отображаем
    return; // прерываем выполнение
  }
  
  // если данные есть, подготавливаем их к отрисовке
  noResults.style.display = 'none';
  cardsContainer.style.display = 'grid';
  
  // цикл по массиву, создаем карточки, data.ForEach - проходим по каждому элементу массива data, Service - текущая услуга этой итерации
  // => выполняет код внутри для каждой услуги
  data.forEach(service => {
    // создаем новый элемент <article> - семантический тег для самостоятельной сущности - карточки  
    const card = document.createElement('article');
    // добавляем класс для стилизации, добавляем имя к классу
    card.className = 'service-card';
    
    // проверяем, включен ли режим скидок и есть ли у этой услуги поле discountedPrice
    const priceDisplay = showDiscount && service.discountedPrice 
          ? `<div class="price-wrapper">
             <span class="price-original">$${service.price}</span>
             <span class="price-current">$${service.discountedPrice}</span>
             </div>`
           : `<span class="price-current">$${service.price}</span>`;
    
    const starCount = Math.round(service.rating);
    const starsHTML = Array.from({ length: 1}, () => 
    `<img src="../pictures/star.svg" alt="*" class="rating-star">`
    ).join('');

    card.innerHTML = `
      <img src="${service.image}" alt="${service.name}'">
      <div class="card-content">
        <span class="card-category">${service.category}</span>
        <h3 class="card-title">${service.name}</h3>
        <p class="card-description">${service.description}</p>
        <div class="card-meta">
          <span class="card-price">${priceDisplay}</span>
          <span class="card-rating">${starsHTML} ${service.rating}</span>
        </div>
      </div>
    `;
    
    cardsContainer.appendChild(card); //добавляет новый элемент в конец списка дочерних элементов указанного родителя
    // то есть эта строка втавляет готовую карточку в контейнер и после нее карточка появлеятся на экране
  });
}

// фильтрация и сортировка (Этап 3) ===
function applyFilters() {
  let result = [...services]; //создаем копию массива
  
  const searchTerm = searchInput.value.toLowerCase().trim(); // берем текст из поля поиска, приводим к нижнему регистру и убираем пробелы
   /*если поле не пустое, запускаем поиск*/
 if (searchTerm) // если поле не упстое - запускаем филтрацию
 {
    result = result.filter(s =>  /*создаем ноывй массив только с подходящими элементами исходя из поисковой строки*/
      s.name.toLowerCase().includes(searchTerm) ||  /*проверяет, содержится ли поисковой запрос в названии услуги*/
      s.description.toLowerCase().includes(searchTerm) /*проверяет описание на наличие запроса*/
    );
  }
  
  const category = categorySelect.value; //берет выбранное значение из выпадающего списка
  if (category !== 'all') //если не выбран пункт все категории, применяем фильтр
  {
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
      //localCompare сраквнивает 2 строки с учтом языковых правил и возвращает число, указывающее, где должна стоять текущая строка
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
  
  renderCards(result); //передаем отфильтрованный и отрисованный массив к карточкам
}

// генерация кнопок методов ===
function renderMethodButtons() {
  arrayMethods.forEach((item) => {
    const btn = document.createElement('button'); // кнопка создается только в памяти
    btn.className = 'method-btn';
    btn.textContent = item.name;
    btn.title = item.method.toString(); //превращаем функцию в строку
    
   /*обрабочик клика*/ btn.addEventListener('click', () => {
      document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active')); //находит все копки с классом method-btn, remove - убираем подсвет у всех кнопок
      btn.classList.add('active');  // добавляем подсвет только к нажатой кнопке
      
      const result = item.method(); //вызываем функцию, хранящуюся в объекте
      const showDiscount = item.name.includes('discount');
      renderCards(result, showDiscount);
    });
    
    methodsGrid.appendChild(btn); // добавляем на страницу
  });
  
  // кнопка сброса
  const resetBtn = document.createElement('button');
  resetBtn.className = 'method-btn';
  resetBtn.textContent = 'Reset';
  resetBtn.style.background = '#666';
  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
    searchInput.value = ''; //удляем текст, который пользователь ввел в поиск
    sortSelect.value = 'default'; //переключает выпадающий список на default
    categorySelect.value = 'all'; // категории - все
    renderCards(services); // отрисовываем
  });
  methodsGrid.appendChild(resetBtn);
}

// инициализация ===
function init() {
  renderCards(services);
  renderMethodButtons();
  

  //input отслеживает любое изменение в поле ввода в реальном времени
  searchInput.addEventListener('input', applyFilters); //слушаем указанное событие на элементе
  sortSelect.addEventListener('change', applyFilters); //'change' - знаечние изменилось и фокус вышел с элемента
  categorySelect.addEventListener('change', applyFilters);
  //в (тип события, функция обработчик)
}

document.addEventListener('DOMContentLoaded', init);