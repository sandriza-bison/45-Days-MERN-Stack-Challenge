// script.js - theme toggle + persistence + keyboard accessibility
(() => {
  const THEME_KEY = 'bizcard-theme';
  const toggleBtn = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      toggleBtn.setAttribute('aria-pressed', 'true');
      toggleBtn.textContent = '☀️ Light Mode';
    } else {
      document.body.classList.remove('dark-theme');
      toggleBtn.setAttribute('aria-pressed', 'false');
      toggleBtn.textContent = '🌙 Dark Mode';
    }
  }

  // Load saved preference
  window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved === 'dark' ? 'dark' : 'light');
  });

  // Click toggles theme and saves
  toggleBtn.addEventListener('click', () => {
    const nowDark = document.body.classList.contains('dark-theme');
    const next = nowDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // Keyboard support: Space & Enter
  toggleBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
      e.preventDefault();
      toggleBtn.click();
    }
  });
})();
