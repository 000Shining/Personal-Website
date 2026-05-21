/* === Portfolio: List + Detail Rendering === */

(function() {
  const listGrid = document.getElementById('projects-grid');
  const detailContainer = document.getElementById('project-detail');

  // --- List Page ---
  if (listGrid) {
    const empty = document.getElementById('empty-state');

    fetch('data/projects.json')
      .then(res => res.json())
      .then(projects => {
        if (!projects.length) {
          empty.style.display = '';
          return;
        }

        listGrid.innerHTML = projects.map((p, i) => `
          <div class="portfolio-card animate-in ${i < 6 ? 'stagger-'+(i+1) : ''}" onclick="location.href='portfolio-detail.html?id=${p.id}'">
            <div class="card-image">${p.image ? `<img src="${p.image}" alt="${escapeHTML(p.name)}" style="width:100%;height:100%;object-fit:cover;">` : '📁 Project Screenshot'}</div>
            <div class="card-body">
              <h3>${escapeHTML(p.name)}</h3>
              <p>${escapeHTML(p.description)}</p>
              <div class="card-tags">
                ${p.techStack.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('');
      })
      .catch(err => {
        console.error('Failed to load projects:', err);
        listGrid.innerHTML = '<div class="empty-state"><h3>Failed to load projects</h3></div>';
      });
  }

  // --- Detail Page ---
  if (detailContainer) {
    const params = new URLSearchParams(window.location.search);
    const projectId = parseInt(params.get('id'), 10);

    if (!projectId) {
      detailContainer.innerHTML = '<div class="empty-state"><h3>No project specified</h3><p><a href="portfolio.html">Back to Portfolio</a></p></div>';
      return;
    }

    fetch('data/projects.json')
      .then(res => res.json())
      .then(projects => {
        const project = projects.find(p => p.id === projectId);
        if (!project) {
          detailContainer.innerHTML = '<div class="empty-state"><h3>Project not found</h3><p><a href="portfolio.html">Back to Portfolio</a></p></div>';
          return;
        }

        detailContainer.innerHTML = `
          <div class="portfolio-detail animate-in stagger-1">
            <a href="portfolio.html" class="back-link">&larr; Back to Portfolio</a>
            <div class="page-header">
              <h1>${escapeHTML(project.name)}</h1>
              <p>${escapeHTML(project.description)}</p>
            </div>
            <div class="card-tags" style="margin-bottom:2rem;">
              ${project.techStack.map(t => `<span class="tag tag-accent">${escapeHTML(t)}</span>`).join('')}
            </div>
            <div class="article-content" style="max-width:720px;">
              ${project.detail}
            </div>
            <div class="project-links">
              ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" rel="noopener" class="btn btn-primary">View Live</a>` : ''}
              ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" rel="noopener" class="btn btn-outline">View on GitHub</a>` : ''}
            </div>
          </div>
        `;
      })
      .catch(err => {
        console.error('Failed to load project:', err);
        detailContainer.innerHTML = '<div class="empty-state"><h3>Failed to load project</h3><p><a href="portfolio.html">Back to Portfolio</a></p></div>';
      });
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
