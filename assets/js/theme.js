const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
  function updateThemeButton() {
    const isLight = document.documentElement.dataset.theme === 'light';
    const nextMode = isLight ? 'Tech' : 'Hobby';
    themeToggle.setAttribute('aria-label', `Switch to ${nextMode} mode`);
    themeToggle.querySelector('.theme-name').textContent = nextMode;
  }

  updateThemeButton();
  themeToggle.hidden = false;
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    let saved = false;
    try { localStorage.setItem('theme', theme); saved = true; } catch (e) {}
    updateThemeButton();
    const current = location.pathname.replace(/\/$/, '');
    const techPath = themeToggle.dataset.techUrl.replace(/\/$/, '');
    const hobbyPath = themeToggle.dataset.hobbyUrl.replace(/\/$/, '');
    if (saved && ((theme === 'light' && current === techPath) || (theme === 'dark' && current === hobbyPath))) {
      location.assign(theme === 'light' ? themeToggle.dataset.hobbyUrl : themeToggle.dataset.techUrl);
    }
  });
}
