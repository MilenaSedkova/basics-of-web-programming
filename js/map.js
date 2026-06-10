// Initialize Yandex Map
ymaps.ready(initMap);

function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  const myMap = new ymaps.Map("map", {
    center: [55.751574, 37.573856], // Moscow coordinates
    zoom: 12,
    controls: ['zoomControl']
  });

  const myPlacemark = new ymaps.Placemark(
    [55.751574, 37.573856], 
    { hintContent: 'Moon Coach Studio', balloonContent: 'We are here!' },
    { preset: 'islands#icon', iconColor: '#8B7500' }
  );

  myMap.geoObjects.add(myPlacemark);
}
