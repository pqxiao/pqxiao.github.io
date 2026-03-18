// i18n.js - Handles fetching and rendering of internationalized data
let currentData = null;

async function loadLanguage(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);
    if (!response.ok) throw new Error("Failed to load language file");
    currentData = await response.json();
    renderPage(currentData);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('lang', lang);
  } catch (error) {
    console.error("Error loading language:", error);
  }
}

function resolvePath(obj, path) {
  return path.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), obj);
}

function renderPage(data) {
  // 1. Render simple text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const content = resolvePath(data, el.getAttribute('data-i18n'));
    if (content) {
      if (el.tagName === 'TITLE') {
        document.title = content;
      } else {
        el.innerHTML = content;
      }
    }
  });

  // 2. Render lists
  const interestsList = document.getElementById('interests-list');
  interestsList.innerHTML = data.profile.interests.map(i => `<li><i class="${i.icon}"></i> ${i.text}</li>`).join('');

  const eduList = document.getElementById('education-list');
  eduList.innerHTML = data.profile.education.map(e => `
    <div class="edu-item">
      <i class="${e.icon}"></i> 
      <p><strong>${e.degree}</strong><br>${e.school}, ${e.year}</p>
    </div>
  `).join('');

  const expList = document.getElementById('experience-list');
  expList.innerHTML = data.experience.map(e => `
    <div class="tl-item">
      <h4>${e.role} · <a href="#">${e.company}</a></h4>
      <span class="tl-date">${e.date} · ${e.location}</span>
      <p>${e.desc}</p>
    </div>
  `).join('');

  const awardsList = document.getElementById('awards-list');
  awardsList.innerHTML = data.awards.map(a => `
    <div class="award-item">
      <h4>${a.title}</h4>
      <span class="tl-date">${a.date}</span>
      <p>${a.desc} <a href="${a.link}" target="_blank">${a.linkText}</a></p>
    </div>
  `).join('');

  const projList = document.getElementById('projects-list');
  projList.innerHTML = data.projects.map(p => `
    <article class="proj-card" onclick="openDetails('projects', '${p.id}')">
      <div class="proj-info">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <div class="links">
           <span class="btn-link">${data.sections.viewDetails} <i class="fas fa-arrow-right"></i></span>
        </div>
      </div>
    </article>
  `).join('');

  const galleryList = document.getElementById('gallery-grid');
  galleryList.innerHTML = data.gallery.map(g => `
    <div class="gallery-item" onclick="openDetails('gallery', '${g.id}')">
        <div class="img-wrap"><img src="${g.img}" alt="${g.title}"></div>
        <h5>${g.title}</h5>
    </div>
  `).join('');

  // 3. Render Contact
  document.getElementById('contact-email').textContent = data.contact.email;
  document.getElementById('contact-address').textContent = data.contact.address;
  document.getElementById('contact-github').href = data.contact.github;
  document.getElementById('contact-linkedin').href = data.contact.linkedin;
  document.getElementById('contact-twitter').href = data.contact.twitter;
}

// Ensure the details rendering function is accessible globally
window.openDetails = function(type, id) {
  if (!currentData || !currentData[type]) return;
  const item = currentData[type].find(x => x.id === id);
  if (!item) return;

  const modal = document.getElementById('detailModal');
  const modalContent = document.getElementById('modalContent');
  
  modalContent.innerHTML = `
    <article class="detail-art">
      <h1>${item.title}</h1>
      <span class="tl-date" style="display:block;margin-bottom:20px;">${currentData.sections.datePrefix || 'Date:'} ${item.detailsDate}</span>
      ${item.detailsBody}
    </article>
  `;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.closeDetails = function() {
  const modal = document.getElementById('detailModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}
