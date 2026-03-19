const fs = require('fs');
let html = fs.readFileSync('project.html', 'utf8');

const newScript = `  <script type="module">
    import { initLanguage, loadLanguage } from './assets/js/i18n.js';
    import { setupTheme } from './assets/js/main.js';

    // Theme setup
    setupTheme();
    
    // Parse URL params
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    // Lang Logic
    let lang = localStorage.getItem('site_lang') || 'en';
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = lang === 'zh' ? 'EN' : '中';
      toggleBtn.addEventListener('click', async () => {
        lang = lang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('site_lang', lang);
        toggleBtn.textContent = lang === 'zh' ? 'EN' : '中';
        await renderProjectContent(lang, projectId);
      });
    }

    // Render logic
    await renderProjectContent(lang, projectId);

    async function renderProjectContent(lang, projectId) {
      if (!projectId) {
        document.getElementById('project-detail-container').innerHTML = '<h2>Project ID not specified.</h2><p><a href="index.html">Return to Home</a></p>';
        return;
      }

      try {
        const res = await fetch(\`lang/\${lang}.json\`);
        const data = await res.json();
        
        // Let's set the nav back button language dynamically too if there's data for it!
        const navLinks = document.getElementById('nav-links-container');
        if (navLinks && data.nav) {
            navLinks.innerHTML = \`<a href="index.html">← \${data.nav.home || 'Back to Home'}</a>\`;
        }

        const project = data.projects ? data.projects.find(p => p.id === projectId) : null;
        
        if (!project) {
          document.getElementById('project-detail-container').innerHTML = '<h2>Project not found.</h2><p><a href="index.html">Return to Home</a></p>';
          return;
        }

        const container = document.getElementById('project-detail-container');
        container.innerHTML = \`
          <div class="project-detail-header" style="max-width: 800px; margin: 0 auto; padding: 40px 0;">
            <h1>\${project.title}</h1>
            <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 30px;">\${project.shortDesc}</p>
            \${project.image ? \`<img src="\${project.image}" alt="\${project.title}" style="width: 100%; border-radius: var(--radius-md); margin-bottom: 30px;">\` : ''}
            
            <div class="project-content" style="line-height: 1.8;">
              \${project.fullDesc || '<p>Detailed description goes here. Extend JSON structure to separate this.</p>'}
              
              <!-- Video Placeholder -->
              <div style="margin-top: 40px; background: var(--bg-section); padding: 40px; text-align: center; border-radius: var(--radius-md); border: 1px dashed var(--border-light);">
                 <h3>Video Demo Placeholder</h3>
                 <p style="color: var(--text-muted)">Edit this template in project.html to embed iframe videos easily later.</p>
              </div>
            </div>
            
            <div style="margin-top: 50px;">
              <a href="index.html" class="btn-link">← \${data.nav ? (data.nav.home || 'Back to Home') : 'Back to Home'}</a>
            </div>
          </div>
        \`;
        
      } catch (err) {
        console.error(err);
        document.getElementById('project-detail-container').innerHTML = '<h2>Error loading project data.</h2>';
      }
    }
  </script>`;

html = html.replace(/<script type="module">[\s\S]*?<\/script>/, newScript);
fs.writeFileSync('project.html', html);
console.log('project.html updated');
