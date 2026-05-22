/* === Blog Detail: Markdown Rendering + TOC === */

(function() {
  const container = document.getElementById('blog-detail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const postId = parseInt(params.get('id'), 10);

  if (!postId) {
    container.innerHTML = '<div class="empty-state"><h3>No article specified</h3><p><a href="blog.html">Back to Blog</a></p></div>';
    return;
  }

  fetch('data/posts.json')
    .then(res => res.json())
    .then(posts => {
      const post = posts.find(p => p.id === postId);
      if (!post) {
        container.innerHTML = '<div class="empty-state"><h3>Article not found</h3><p><a href="blog.html">Back to Blog</a></p></div>';
        return;
      }
      return fetch(post.file).then(res => res.text()).then(md => ({ post, md }));
    })
    .then(result => {
      if (!result) return;
      const { post, md } = result;

      // Parse frontmatter and body
      let body = md;
      if (md.startsWith('---')) {
        const end = md.indexOf('---', 3);
        if (end !== -1) {
          body = md.slice(end + 3).trim();
        }
      }

      // Render Markdown
      const htmlContent = marked.parse(body);

      // Build TOC from headings in rendered HTML
      const temp = document.createElement('div');
      temp.innerHTML = htmlContent;
      const headings = temp.querySelectorAll('h2, h3, h4');

      // Assign IDs
      const tocItems = [];
      headings.forEach((h, idx) => {
        const id = 'section-' + idx;
        h.id = id;
        tocItems.push({
          level: h.tagName.toLowerCase(),
          text: h.textContent,
          id: id
        });
      });

      const contentHTML = temp.innerHTML;

      // Build TOC HTML
      let tocHTML = '';
      if (tocItems.length > 0) {
        tocHTML = '<h4>Contents</h4><ul class="toc-list">';
        tocItems.forEach(item => {
          const cls = 'toc-' + item.level;
          tocHTML += `<li class="${cls}"><a href="#${item.id}">${escapeHTML(item.text)}</a></li>`;
        });
        tocHTML += '</ul>';
      }

      // Render full layout
      container.innerHTML = `
        <div class="page-header animate-in stagger-1">
          <a href="blog.html" style="font-size:var(--font-size-sm);color:var(--color-text-light);">&larr; Back to Blog</a>
        </div>
        <div class="blog-detail-layout">
          <aside class="toc-sidebar animate-in stagger-2">
            ${tocHTML}
          </aside>
          <article class="blog-article animate-in stagger-3">
            <div class="article-header">
              <h1>${escapeHTML(post.title)}</h1>
              <div class="article-meta">
                <span>${post.date}</span>
                ${post.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
              </div>
            </div>
            <div class="article-content">${contentHTML}</div>
          </article>
        </div>
      `;

      // TOC active tracking
      if (tocItems.length > 0) {
        const tocLinks = document.querySelectorAll('.toc-list a');
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              tocLinks.forEach(a => a.classList.remove('active'));
              const link = document.querySelector(`.toc-list a[href="#${entry.target.id}"]`);
              if (link) link.classList.add('active');
            }
          });
        }, { rootMargin: '-80px 0px -60% 0px' });

        tocItems.forEach(item => {
          const el = document.getElementById(item.id);
          if (el) observer.observe(el);
        });

        // Smooth scroll for TOC clicks
        tocLinks.forEach(link => {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          });
        });
      }

      // Convert <pre><code class="language-mermaid"> to <div class="mermaid">
      const articleEl = container.querySelector('.article-content');
      if (articleEl) {
        const mermaidCodes = articleEl.querySelectorAll('pre code.language-mermaid');
        mermaidCodes.forEach(code => {
          const div = document.createElement('div');
          div.className = 'mermaid';
          div.textContent = code.textContent;
          code.parentElement.replaceWith(div);
        });
      }

      // Render Mermaid diagrams
      if (container.querySelectorAll('.mermaid').length > 0) {
        (async () => {
          try {
            await mermaid.run({ querySelector: '.mermaid' });
          } catch (e) { /* silently skip on parse error */ }
        })();
      }
    })
    .catch(err => {
      console.error('Failed to load article:', err);
      container.innerHTML = '<div class="empty-state"><h3>Failed to load article</h3><p><a href="blog.html">Back to Blog</a></p></div>';
    });

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
