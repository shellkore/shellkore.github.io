const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('assets/js/theme.js', 'utf8');

function setup(theme, path, storageWorks = true) {
  const label = {};
  const button = {
    dataset: { techUrl: '/projects/', hobbyUrl: '/travel/' },
    querySelector: () => label,
    setAttribute: (name, value) => { button[name] = value; },
    addEventListener: (name, handler) => { button.click = handler; }
  };
  const document = { documentElement: { dataset: { theme } }, querySelector: () => button };
  const location = { pathname: path, assign: url => { location.redirected = url; } };
  const localStorage = { setItem: (key, value) => { if (!storageWorks) throw Error(); localStorage[key] = value; } };
  vm.runInNewContext(source, { document, location, localStorage });
  return { button, label, document, location, localStorage };
}

test('switches from Tech to Hobby and redirects the projects page', () => {
  const state = setup('dark', '/projects/');
  assert.equal(state.button['aria-label'], 'Switch to Hobby mode');
  state.button.click();
  assert.equal(state.document.documentElement.dataset.theme, 'light');
  assert.equal(state.localStorage.theme, 'light');
  assert.equal(state.location.redirected, '/travel/');
  assert.equal(state.label.textContent, 'Tech');
});

test('switches from Hobby to Tech and redirects the travel page', () => {
  const state = setup('light', '/travel');
  state.button.click();
  assert.equal(state.localStorage.theme, 'dark');
  assert.equal(state.location.redirected, '/projects/');
});

test('keeps shared pages and unavailable storage in place', () => {
  const shared = setup('dark', '/about/');
  shared.button.click();
  assert.equal(shared.location.redirected, undefined);
  const unavailable = setup('dark', '/projects/', false);
  unavailable.button.click();
  assert.equal(unavailable.document.documentElement.dataset.theme, 'light');
  assert.equal(unavailable.location.redirected, undefined);
});
