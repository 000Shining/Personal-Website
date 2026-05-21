/* === Shared: Navigation, Footer, Role UI === */

(function() {
  const role = getRole();
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // --- Inject Navigation ---
  const navHTML = `
    <nav class="nav">
      <a href="index.html" class="nav-brand">Shiling</a>
      <button class="nav-toggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="portfolio.html">Portfolio</a></li>
        <li class="nav-about-hidden"><a href="about.html">About</a></li>
        <li><button class="nav-role-switch" title="Switch identity">${role === 'hr' ? 'HR' : 'Visitor'}</button></li>
      </ul>
    </nav>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // --- Active link ---
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(a => {
    if (a.getAttribute('href') === currentPath) {
      a.classList.add('active');
    }
  });

  // --- Role-based About visibility ---
  const aboutLi = document.querySelector('.nav-about-hidden');
  if (role === 'hr') {
    aboutLi.classList.remove('nav-about-hidden');
  }

  // --- Role switch button ---
  const switchBtn = document.querySelector('.nav-role-switch');
  if (switchBtn) {
    switchBtn.addEventListener('click', function() {
      clearRole();
      window.location.href = 'index.html';
    });
  }

  // --- Mobile nav toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
  }

  // --- Inject Footer ---
  const footerHTML = `
    <footer class="site-footer">
      <div class="social-links">
        <a href="https://github.com/shiling" target="_blank" rel="noopener" title="GitHub">GitHub</a>
        <a href="https://linkedin.com/in/shiling" target="_blank" rel="noopener" title="LinkedIn">LinkedIn</a>
        <a href="mailto:shiling@example.com" title="Email">Email</a>
      </div>
      <p>&copy; ${new Date().getFullYear()} Shiling. All rights reserved.</p>
    </footer>
  `;

  document.body.insertAdjacentHTML('beforeend', footerHTML);
})();
