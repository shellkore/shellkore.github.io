const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('assets/js/travel.js', 'utf8');

function setup() {
  const cards = [
    { dataset: { country: 'Vietnam', lat: '16', lng: '107.8' } },
    { dataset: { country: 'Austria', lat: '47.5', lng: '14.6' } }
  ];
  cards.forEach(card => { card.addEventListener = (_, handler) => { card.click = handler; }; });
  const title = {}, description = {};
  const dialog = { open: false, showModal() { this.open = true; } };
  const choices = { children: [], replaceChildren() { this.children = []; }, appendChild(button) { this.children.push(button); } };
  const document = {
    documentElement: { dataset: { theme: 'light' } },
    querySelectorAll: () => cards,
    querySelector: selector => ({ '.country-dialog': dialog, '#country-dialog-title': title, '#country-dialog-description': description, '.country-dialog-choices': choices, '#travel-globe': {} })[selector],
    createElement: () => ({ addEventListener(_, handler) { this.click = handler; } })
  };
  class MutationObserver { observe() {} }
  const context = vm.createContext({ document, MutationObserver, window: {} });
  vm.runInContext(source, context);
  return { cards, title, description, dialog, choices, context };
}

test('country cards still open when globe libraries are unavailable', () => {
  const state = setup();
  state.cards[0].click();
  assert.equal(state.title.textContent, 'Vietnam');
  assert.match(state.description.textContent, /Adding more data soon/);
  assert.equal(state.dialog.open, true);
});

test('nearby projected countries are grouped without losing distant pins', () => {
  const state = setup();
  const groups = state.context.groupPins([
    { x: 100, y: 100, country: { name: 'Austria' } },
    { x: 105, y: 103, country: { name: 'Slovenia' } },
    { x: 200, y: 200, country: { name: 'Vietnam' } }
  ]);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].countries.length, 2);
  assert.equal(groups[1].countries[0].name, 'Vietnam');
});

test('a grouped pin lets visitors choose a country', () => {
  const state = setup();
  state.context.openGroup({ countries: [{ name: 'Austria' }, { name: 'Slovenia' }] });
  assert.equal(state.title.textContent, 'Choose a country');
  assert.equal(state.choices.children.length, 2);
  state.choices.children[1].click();
  assert.equal(state.title.textContent, 'Slovenia');
  assert.equal(state.choices.children.length, 0);
});

test('zoom remains within the globe limits', () => {
  const { context } = setup();
  assert.equal(context.zoomScale(222, .5), 222);
  assert.equal(context.zoomScale(222, 2), 444);
  assert.equal(context.zoomScale(1776, 2), 1776);
});

test('pinching zooms in and out and suspends dragging until both fingers lift', () => {
  const { context } = setup();
  const handlers = {}, factors = [];
  const isPinching = context.enablePinchZoom({ addEventListener(type, handler) { handlers[type] = handler; } }, factor => factors.push(factor));
  const touch = x => ({ clientX: x, clientY: 0 });
  const send = (type, touches) => handlers[type]({ touches, preventDefault() {} });
  send('touchstart', [touch(0)]);
  send('touchstart', [touch(0), touch(100)]);
  send('touchmove', [touch(0), touch(150)]);
  send('touchmove', [touch(0), touch(75)]);
  assert.deepEqual(factors, [1.5, .5]);
  send('touchend', [touch(0)]);
  assert.equal(isPinching(), true);
  send('touchend', []);
  assert.equal(isPinching(), false);
  send('touchstart', [touch(0), touch(50)]);
  assert.equal(factors.length, 2);
});
