document.addEventListener('DOMContentLoaded', async () => {
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open));
  });
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => { if (a.getAttribute('href') === current) a.classList.add('active'); });

  const homeSkills = document.getElementById('home-skills');
  if (homeSkills) {
    try {
      const data = await fetch('data/skills.json').then(r => { if(!r.ok) throw new Error('Could not load skills.json'); return r.json(); });
      const skillIcons = {
        'Python': 'Py', 'C++': 'C++', 'SQL': 'SQL', 'Machine Learning': 'ML',
        'Natural Language Processing': 'NLP', 'Computer Vision': 'CV',
        'Data Analysis': 'DA', 'Java / C#': 'J/C', 'JavaScript': 'JS', 'MATLAB': 'M'
      };
      homeSkills.innerHTML = (data.skills || []).map(s => `<article class="skill-card"><div class="skill-top"><span class="skill-icon" aria-hidden="true">${escapeHTML(skillIcons[s.name] || '✦')}</span><strong>${escapeHTML(s.name)}</strong></div><span>${escapeHTML(s.category || 'Technical skill')}</span></article>`).join('') || '<p class="empty-note">Add your skills in data/skills.json.</p>';
    } catch(e) { homeSkills.innerHTML = '<p class="empty-note">Could not load skills. Run this website through a local server and check data/skills.json.</p>'; }
  }

  const content = document.getElementById('page-content');
  if (content) {
    try {
      const data = await fetch(content.dataset.source).then(r => { if(!r.ok) throw new Error('Could not load JSON'); return r.json(); });
      const items = Array.isArray(data) ? data : (data.items || data[content.dataset.page] || []);
      content.innerHTML = items.length ? items.map(item => content.dataset.page === 'certificate' ? renderLearningCourse(item) : renderCard(item)).join('') : '<p class="empty-note">No entries yet. Add your information to the matching JSON file inside the data folder.</p>';
    } catch(e) { content.innerHTML = '<p class="empty-note">Unable to load this page data. Please run the website using a local web server.</p>'; }
  }
});
function renderLearningCourse(item) {
  const completed = item.status === 'Completed';
  const preview = item.url ? `<iframe class="certificate-preview" src="${escapeHTML(item.url)}#toolbar=0&navpanes=0&scrollbar=0" title="${escapeHTML(item.title || 'Certificate')} preview"></iframe>` : '';
  const link = item.url ? `<a class="course-link" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>` : '';
  return `<article class="learning-course">${preview}<div class="course-details"><div class="course-mark" aria-hidden="true">${completed ? '✓' : '◷'}</div><div class="course-copy"><span class="course-category">${escapeHTML(item.category || 'Course')}</span><h3>${escapeHTML(item.title || 'Untitled')}</h3><span class="course-issuer">${escapeHTML(item.issuer || 'DataCamp')}</span></div><span class="course-status ${completed ? 'is-completed' : 'is-progress'}">${escapeHTML(item.status || 'In progress')}</span>${link}</div></article>`;
}
function renderCard(item) {
  const image = item.image ? `<img class="card-image" src="assets/images/${escapeHTML(item.image)}" alt="${escapeHTML(item.title || item.name || 'Portfolio image')}" onerror="this.style.display='none'">` : '';
  const title = item.title || item.name || 'Untitled';
  const meta = [item.period, item.organization, item.issuer, item.type].filter(Boolean).join(' · ');
  const description = item.description || item.summary || '';
  const tags = Array.isArray(item.tags) ? `<div class="tag-list">${item.tags.map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('')}</div>` : '';
  const bullets = Array.isArray(item.highlights) ? `<ul>${item.highlights.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul>` : '';
  const link = item.url ? `<a href="${escapeHTML(item.url)}" target="_blank" rel="noreferrer">View details ↗</a>` : '';
  return `<article class="content-card">${image}<h2>${escapeHTML(title)}</h2>${meta?`<div class="meta">${escapeHTML(meta)}</div>`:''}${description?`<p>${escapeHTML(description)}</p>`:''}${bullets}${tags}${link}</article>`;
}
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
