const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
  function updateThemeButton() {
    const isLight = document.documentElement.dataset.theme === 'light';
    const nextTheme = isLight ? 'dark' : 'light';
    themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
    themeToggle.querySelector('.theme-label').textContent = `${nextTheme[0].toUpperCase()}${nextTheme.slice(1)} mode`;
  }

  updateThemeButton();
  themeToggle.hidden = false;
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch (e) {}
    updateThemeButton();
  });
}
