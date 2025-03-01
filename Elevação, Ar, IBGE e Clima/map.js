let map;
let elevationService;
let marker;
let geocoder;

function initMap() {
  const initialPosition = { lat: -25.344, lng: 131.031 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: initialPosition,
  });
  elevationService = new google.maps.ElevationService();

  geocoder = new google.maps.Geocoder();

  marker = new google.maps.Marker({
    position: initialPosition,
    map: map,
    title: "Uluru",
    draggable: true,
  });

  google.maps.event.addListener(marker, "click", function () {
    fetchElevation(marker.getPosition().lat(), marker.getPosition().lng());
    getAirQuality(marker.getPosition().lat(), marker.getPosition().lng());
    checkLocationAndFetchIBGEData(
      marker.getPosition().lat(),
      marker.getPosition().lng()
    );
    getWeatherData(marker.getPosition().lat(), marker.getPosition().lng());
  });

  google.maps.event.addListener(marker, "dragend", function () {
    fetchElevation(marker.getPosition().lat(), marker.getPosition().lng());
    getAirQuality(marker.getPosition().lat(), marker.getPosition().lng());
    checkLocationAndFetchIBGEData(
      marker.getPosition().lat(),
      marker.getPosition().lng()
    );
    getWeatherData(marker.getPosition().lat(), marker.getPosition().lng());
  });

  fetchElevation(initialPosition.lat, initialPosition.lng);
  getAirQuality(initialPosition.lat, initialPosition.lng);
  checkLocationAndFetchIBGEData(initialPosition.lat, initialPosition.lng);
  getWeatherData(initialPosition.lat, initialPosition.lng);
}

function updateMap() {
  const lat = parseFloat(document.getElementById("latitude").value);
  const lng = parseFloat(document.getElementById("longitude").value);

  if (!isNaN(lat) && !isNaN(lng)) {
    const newPosition = new google.maps.LatLng(lat, lng);
    marker.setPosition(newPosition);
    map.setCenter(newPosition);

    fetchElevation(lat, lng);
    getAirQuality(lat, lng);
    checkLocationAndFetchIBGEData(lat, lng);
    getWeatherData(lat, lng);
  } else {
    alert("Por favor, insira valores válidos para latitude e longitude.");
  }
}

// Inicializa o mapa assim que a página for carregada
window.onload = initMap;
