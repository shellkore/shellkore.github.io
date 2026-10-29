const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('assets/js/travel.js', 'utf8');

function setup(theme, hasMap = true, hasClusters = false) {
  const cards = [
    { dataset: { country: 'Vietnam', lat: '16', lng: '107.8' } },
    { dataset: { country: 'Austria', lat: '47.5', lng: '14.6' } }
  ];
  cards.forEach(card => { card.addEventListener = (_, handler) => { card.click = handler; }; });
  const title = {};
  const dialog = { showModal() { this.opened = true; } };
  const mapElement = { querySelector: () => ({ remove() {} }) };
  const document = {
    documentElement: { dataset: { theme } },
    querySelectorAll: () => cards,
    querySelector: selector => ({ '.country-dialog': dialog, '#country-dialog-title': title, '#travel-map': mapElement })[selector]
  };
  const markers = [];
  const map = { fitBounds(bounds) { this.bounds = bounds; }, addLayer(layer) { this.layer = layer; }, invalidateSize() { this.resized = true; } };
  const L = {
    map: () => map,
    tileLayer: () => ({ addTo() {} }),
    divIcon: () => ({}),
    marker: (position, options) => {
      const marker = { position, options, addTo() { if (this.onAdd) this.onAdd(); return this; }, getElement: () => ({ setAttribute() {} }), bindTooltip() {}, on(event, handler) { if (event === 'add') this.onAdd = handler; else this.click = handler; return this; } };
      markers.push(marker);
      return marker;
    }
  };
  if (hasClusters) L.markerClusterGroup = () => ({});
  let onThemeChange;
  class MutationObserver { constructor(handler) { onThemeChange = handler; } observe() {} }
  const context = { document, MutationObserver };
  if (hasMap) context.L = L;
  vm.runInNewContext(source, context);
  return { cards, markers, title, dialog, document, map, onThemeChange };
}

test('cards and map pins open the same country dialog', () => {
  const state = setup('light');
  assert.equal(state.markers.length, 2);
  assert.equal(state.map.bounds.length, 2);
  state.cards[0].click();
  assert.equal(state.title.textContent, 'Vietnam');
  assert.equal(state.dialog.opened, true);
  state.markers[1].click();
  assert.equal(state.title.textContent, 'Austria');
});

test('initializes the map when switching to Hobby mode and resizes it on return', () => {
  const state = setup('dark');
  assert.equal(state.markers.length, 0);
  state.document.documentElement.dataset.theme = 'light';
  state.onThemeChange();
  assert.equal(state.markers.length, 2);
  state.onThemeChange();
  assert.equal(state.markers.length, 2);
  assert.equal(state.map.resized, true);
});

test('country cards still work if the map library is unavailable', () => {
  const state = setup('light', false);
  state.cards[0].click();
  assert.equal(state.title.textContent, 'Vietnam');
  assert.equal(state.dialog.opened, true);
});

test('uses a cluster layer when the grouping plugin is available', () => {
  const state = setup('light', true, true);
  assert.equal(state.markers.length, 2);
  assert.ok(state.map.layer);
  state.markers[0].click();
  assert.equal(state.title.textContent, 'Vietnam');
});
