const countryCards = document.querySelectorAll('.country-card');
const countryDialog = document.querySelector('.country-dialog');
const countryTitle = document.querySelector('#country-dialog-title');
const countryDescription = document.querySelector('#country-dialog-description');
const countryChoices = document.querySelector('.country-dialog-choices');
const globeElement = document.querySelector('#travel-globe');
const countries = Array.from(countryCards, card => ({ name: card.dataset.country, lat: Number(card.dataset.lat), lng: Number(card.dataset.lng) }));
let globeReady = false;

function openCountry(name) {
  countryTitle.textContent = name;
  countryDescription.textContent = 'Adding more data soon. City guides, photos, and stories will be here.';
  countryChoices.replaceChildren();
  if (!countryDialog.open) countryDialog.showModal();
}

function openGroup(group) {
  if (group.countries.length === 1) { openCountry(group.countries[0].name); return; }
  countryTitle.textContent = 'Choose a country';
  countryDescription.textContent = 'These destinations are close together on the globe.';
  countryChoices.replaceChildren();
  group.countries.forEach(country => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = country.name;
    button.addEventListener('click', () => openCountry(country.name));
    countryChoices.appendChild(button);
  });
  if (!countryDialog.open) countryDialog.showModal();
}

function groupPins(points) {
  const groups = [];
  points.forEach(point => {
    const group = groups.find(item => Math.hypot(item.x - point.x, item.y - point.y) < 17);
    if (group) {
      const count = group.countries.length;
      group.x = (group.x * count + point.x) / (count + 1);
      group.y = (group.y * count + point.y) / (count + 1);
      group.countries.push(point.country);
    } else groups.push({ x: point.x, y: point.y, countries: [point.country] });
  });
  return groups;
}

countryCards.forEach(card => card.addEventListener('click', () => openCountry(card.dataset.country)));

function showTravelGlobe() {
  if (globeReady || !globeElement || document.documentElement.dataset.theme !== 'light' || typeof d3 === 'undefined' || typeof topojson === 'undefined' || !window.travelWorld) return;
  globeReady = true;
  document.querySelector('.globe-fallback').hidden = true;
  const projection = d3.geoOrthographic().rotate([-67, -28]).translate([250, 250]).scale(222).clipAngle(90);
  const path = d3.geoPath(projection);
  const svg = d3.select(globeElement);
  const ocean = svg.append('path').attr('class', 'globe-ocean');
  const grid = svg.append('path').attr('class', 'globe-grid');
  const land = svg.append('g').selectAll('path').data(topojson.feature(window.travelWorld, window.travelWorld.objects.features).features).join('path').attr('class', 'globe-land');
  const pinLayer = svg.append('g');

  function render() {
    ocean.attr('d', path({ type: 'Sphere' }));
    grid.attr('d', path(d3.geoGraticule10()));
    land.attr('d', path);
    const rotation = projection.rotate();
    const center = [-rotation[0], -rotation[1]];
    const points = countries.filter(country => d3.geoDistance([country.lng, country.lat], center) < Math.PI / 2).map(country => {
      const [x, y] = projection([country.lng, country.lat]);
      return { x, y, country };
    });
    const pins = pinLayer.selectAll('g.globe-pin').data(groupPins(points)).join('g')
      .attr('class', 'globe-pin').attr('transform', group => `translate(${group.x},${group.y})`)
      .attr('role', 'button').attr('tabindex', '0').attr('aria-haspopup', 'dialog')
      .attr('aria-label', group => group.countries.length === 1 ? `Explore ${group.countries[0].name}` : `Choose from ${group.countries.length} nearby countries`)
      .on('click', (_, group) => openGroup(group))
      .on('keydown', (event, group) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openGroup(group); } });
    pins.selectAll('*').remove();
    pins.append('circle').attr('class', 'globe-pin-halo').attr('r', group => group.countries.length > 1 ? 15 : 11);
    pins.append('circle').attr('class', 'globe-pin-core').attr('r', group => group.countries.length > 1 ? 10 : 5);
    pins.filter(group => group.countries.length > 1).append('text').attr('class', 'globe-pin-count').attr('text-anchor', 'middle').attr('dy', '.35em').text(group => group.countries.length);
    pins.append('title').text(group => group.countries.map(country => country.name).join(', '));
  }

  function rotate(dx, dy = 0) {
    const rotation = projection.rotate();
    projection.rotate([rotation[0] + dx, Math.max(-80, Math.min(80, rotation[1] - dy)), 0]);
    render();
  }

  svg.call(d3.drag().filter(event => !event.ctrlKey && !event.button && !event.target.closest('.globe-pin')).on('drag', event => rotate(event.dx * .4, event.dy * .4)));
  document.querySelector('#globe-left').addEventListener('click', () => rotate(-25));
  document.querySelector('#globe-right').addEventListener('click', () => rotate(25));
  render();
}

showTravelGlobe();
new MutationObserver(showTravelGlobe).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
