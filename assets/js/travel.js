const countryCards = document.querySelectorAll('.country-card');
const countryDialog = document.querySelector('.country-dialog');
const countryTitle = document.querySelector('#country-dialog-title');
const mapElement = document.querySelector('#travel-map');
let travelMap;

function openCountry(name) {
  countryTitle.textContent = name;
  countryDialog.showModal();
}

countryCards.forEach(card => card.addEventListener('click', () => openCountry(card.dataset.country)));

function showTravelMap() {
  if (!mapElement || document.documentElement.dataset.theme !== 'light' || typeof L === 'undefined') return;
  if (travelMap) { travelMap.invalidateSize(); return; }
  mapElement.querySelector('.travel-map-fallback')?.remove();
  travelMap = L.map(mapElement, { scrollWheelZoom: false, worldCopyJump: true });
  travelMap.fitBounds(Array.from(countryCards, card => [Number(card.dataset.lat), Number(card.dataset.lng)]), { padding: [28, 28], maxZoom: 2 });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(travelMap);
  const icon = L.divIcon({ className: 'travel-map-marker', html: '<span aria-hidden="true"></span>', iconSize: [24, 24], iconAnchor: [12, 12] });
  const markers = L.markerClusterGroup ? L.markerClusterGroup({
    maxClusterRadius: 28,
    showCoverageOnHover: false,
    iconCreateFunction: cluster => {
      const count = cluster.getChildCount();
      return L.divIcon({ className: 'travel-map-cluster', html: `<span aria-label="${count} countries. Zoom in to explore.">${count}</span>`, iconSize: [36, 36] });
    }
  }) : travelMap;
  countryCards.forEach(card => {
    const marker = L.marker([Number(card.dataset.lat), Number(card.dataset.lng)], { icon, title: card.dataset.country });
    marker.on('add', () => marker.getElement().setAttribute('aria-label', `Explore ${card.dataset.country}`));
    marker.bindTooltip(card.dataset.country, { direction: 'top', offset: [0, -12] });
    marker.on('click', () => openCountry(card.dataset.country));
    marker.addTo(markers);
  });
  if (markers !== travelMap) travelMap.addLayer(markers);
}

showTravelMap();
new MutationObserver(showTravelMap).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
