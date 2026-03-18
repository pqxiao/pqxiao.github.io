// --- i18n & Data Handling ---

const CONFIG = {
  defaultLang: 'zh',
  locales: ['zh', 'en']
};

let currentLang = localStorage.getItem('site_lang') || CONFIG.defaultLang;
if (!CONFIG.locales.includes(currentLang)) currentLang = CONFIG.defaultLang;
let siteData = null; // caches the JSON

export async function initLanguage() {
  await loadLanguage(currentLang);
  document.documentElement.lang = currentLang;
  
  // Update toggle button text if exists
  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn && !toggleBtn.dataset.langBound) {
    toggleBtn.dataset.langBound = 'true';
    toggleBtn.textContent = currentLang === 'zh' ? 'EN' : '中';
    toggleBtn.addEventListener('click', () => {
      const newLang = currentLang === 'zh' ? 'en' : 'zh';
      setLanguage(newLang);
    });
  }
}

async function loadLanguage(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    if (!res.ok) throw new Error('Data fetch failed');
    siteData = await res.json();
    renderPage();
  } catch (err) {
    console.error("Localization error:", err);
    // fallback if possible
  }
}

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('site_lang', lang);
  document.documentElement.lang = lang;
  
  const toggleBtn = document.getElementById('lang-toggle');
  if(toggleBtn) toggleBtn.textContent = lang === 'zh' ? 'EN' : '中';
  
  loadLanguage(lang);
}

// Ensure paths are correct depending on deployment folder
function resolvePath(path) {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('mailto')) return path;
  // If hosted at /pqxiao.github.io/ path adjustment might be needed. Currently assuming root or relative paths work
  return path;
}

// Renders the data into DOM based on data-i18n attributes
function renderPage() {
  if (!siteData) return;

  // 1. Render simple text nodes marked with data-i18n="key.subkey"
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const keyPath = el.getAttribute('data-i18n').split('.');
    let val = siteData;
    for (const k of keyPath) {
      if (val && val[k] !== undefined) {
        val = val[k];
      } else {
        val = null;
        break;
      }
    }
    if (val !== null) {
      if (el.tagName === 'A' && keyPath.includes('resume')) {
        el.href = resolvePath(val);
      } else {
        el.innerHTML = val; // Allows basic HTML in JSON strings
      }
    }
  });

  // 2. Render dynamic array sections based on container id
  
  // Navigation Links
  const navContainer = document.getElementById('nav-links-container');
  if(navContainer && siteData.nav) {
      navContainer.innerHTML = `
        <a href="#about">${siteData.nav.about || 'About'}</a>
        <a href="#projects">${siteData.nav.projects || 'Projects'}</a>
        <a href="#experience">${siteData.nav.experience || 'Experience'}</a>
        <a href="#awards">${siteData.nav.awards || 'Awards'}</a>
        <a href="#gallery">${siteData.nav.gallery || 'Gallery'}</a>
      `;
  }

  // Profile
  const profileBio = document.getElementById('profile-bio');
  if (profileBio && siteData.profile) {
    let bioHtml = '';
    // Special rendering rule based on user preference: 
    // Render English strictly, or Chinese inside detail tag if requested.
    // Given the previous instructions, users might just want natural rendering for the current lang.
    if(Array.isArray(siteData.profile.bio)) {
        bioHtml = siteData.profile.bio.map(p => `<p class="bio-desc">${p}</p>`).join('');
    } else {
        bioHtml = `<p class="bio-desc">${siteData.profile.bio || ''}</p>`;
    }
    // Specific injection for bio paragraphs without overriding the header HTML block
    profileBio.innerHTML = bioHtml;
  }

  // Experience (Timeline Style)
  const expContainer = document.getElementById('experience-list');
  if (expContainer && siteData.experience) {
    expContainer.innerHTML = siteData.experience.map(exp => `
      <div class="tl-item">
        <div class="tl-card">
          <span class="tl-date">${exp.date || ''}</span>
          ${exp.company
            ? `<p class="tl-org">${exp.companyLink
              ? `<a href="${exp.companyLink}" target="_blank" rel="noopener noreferrer">${exp.company}</a>`
              : exp.company}</p>`
            : ''}
          ${exp.role || exp.title ? `<h4 class="tl-title tl-role">${(exp.role || exp.title || '').trim()}</h4>` : ''}
        </div>
      </div>
    `).join('');
  }

  // Awards (Timeline Style)
  const awardsContainer = document.getElementById('awards-list');
  if (awardsContainer && siteData.awards) {
    awardsContainer.innerHTML = `<div class="vertical-timeline">` + siteData.awards.map(aw => `
      <div class="award-item">
        <div class="tl-card">
          <span class="tl-date">${aw.date || ''}</span>
          <h4 class="tl-title">${aw.title || ''}</h4>
          ${aw.desc ? `<p class="tl-desc">${aw.desc}</p>` : ''}
        </div>
      </div>
    `).join('') + `</div>`;
  } else if (awardsContainer) {
    awardsContainer.innerHTML = '';
  }

  // Wrapping Experience into timeline div
  if(expContainer) {
      expContainer.innerHTML = `<div class="vertical-timeline">${expContainer.innerHTML}</div>`;
  }

  // Projects
  const projContainer = document.getElementById('projects-grid');
  if (projContainer && siteData.projects) {
    projContainer.innerHTML = siteData.projects.map(p => `
      <a class="proj-card" href="project.html?id=${encodeURIComponent(p.id || '')}">
        <div class="proj-cover">
          <img src="${resolvePath(p.image || p.img || 'https://via.placeholder.com/800x500?text=Project+Preview')}" alt="${p.title}" loading="lazy">
        </div>
        <div class="proj-info">
          <h4>${p.title}</h4>
          <p>${p.shortDesc || p.desc || ''}</p>
        </div>
      </a>
    `).join('');
  }

  // Gallery
  const galleryContainer = document.getElementById('gallery-grid');
  if (galleryContainer && siteData.gallery) {
    galleryContainer.innerHTML = siteData.gallery.map(g => `
      <div class="gallery-item" onclick="openDetails('gallery', '${g.id}')">
        <div class="img-wrap">
          <img src="${resolvePath(g.image || g.img || 'https://via.placeholder.com/600x400?text=Image+Unavailable')}" alt="${g.title}" loading="lazy">
        </div>
        <h5>${g.title}</h5>
      </div>
    `).join('');
  }
}

// Expose a global method for click handlers for legacy modal (gallery only now)
window.openDetails = function(type, id) {
  if (!siteData || !siteData[type]) return;
  const item = siteData[type].find(i => i.id === id);
  if (!item) return;

  const contentDiv = document.getElementById('modal-content-inject');
  if (!contentDiv) return;

  let html = '';
  if (type === 'gallery') {
    html = `
      <div class="detail-art">
        <h1>${item.title}</h1>
        ${item.detailsBody || item.desc || ''}
        ${(item.image || item.img) ? `<img src="${resolvePath(item.image || item.img)}" alt="${item.title}">` : ''}
      </div>
    `;
  }
  
  contentDiv.innerHTML = html;
  const modal = document.getElementById('detail-modal');
  if(modal) modal.classList.add('active');
};
