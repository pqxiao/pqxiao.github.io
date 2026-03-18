// Theme Toggle Logic
const themeBtn = document.querySelector('.theme-toggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// Language Toggle Logic
const langBtn = document.querySelector('.lang-toggle');
const langBtnText = document.getElementById('lang-btn-text');
if (langBtn) {
  langBtn.addEventListener('click', () => {
    const currentLang = document.documentElement.getAttribute('lang') || 'zh';
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    langBtnText.textContent = newLang === 'zh' ? 'EN' : '中文';
    
    // Call the loadLanguage function from i18n.js
    if (typeof loadLanguage === 'function') {
      loadLanguage(newLang);
    }
  });
}

// Modal closing outside click
const modal = document.getElementById('detailModal');
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal && typeof closeDetails === 'function') {
      closeDetails();
    }
  });
}

// Initial Data Load
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem('lang') || 'zh';
  document.documentElement.setAttribute('lang', savedLang);
  if (langBtnText) {
    langBtnText.textContent = savedLang === 'zh' ? 'EN' : '中文';
  }
  
  if (typeof loadLanguage === 'function') {
    loadLanguage(savedLang);
  }
});
