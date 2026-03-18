// --- Theme Handling ---
export function setupTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle && !themeToggle.dataset.themeBound) {
    themeToggle.dataset.themeBound = 'true';
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

// In ES modules, execution is deferred until DOM is parsed.
setupTheme();

const modal = document.getElementById('detail-modal');
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (typeof window.closeDetails === 'function') {
        window.closeDetails();
      } else {
        modal.classList.remove('active');
      }
    }
  });
}
