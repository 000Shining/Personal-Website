/* === Blog List Rendering === */

(function() {
  const grid = document.getElementById('posts-grid');
  const empty = document.getElementById('empty-state');
  if (!grid) return;

  fetch('data/posts.json')
    .then(res => res.json())
    .then(posts => {
      if (!posts.length) {
        empty.style.display = '';
        return;
      }

      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      grid.innerHTML = posts.map((post, i) => `
        <article class="card animate-in ${i < 3 ? 'stagger-'+(i+1) : ''}" onclick="location.href='blog-detail.html?id=${post.id}'">
          <h3 class="card-title">${escapeHTML(post.title)}</h3>
          <div class="card-meta">
            <span>${post.date}</span>
          </div>
          <p class="card-summary">${escapeHTML(post.summary)}</p>
          <div class="card-tags">
            ${post.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
          </div>
        </article>
      `).join('');
    })
    .catch(err => {
      console.error('Failed to load posts:', err);
      grid.innerHTML = '<div class="empty-state"><h3>Failed to load posts</h3></div>';
    });

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
