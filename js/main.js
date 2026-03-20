// ReviseTonBrevet — main.js

// Scroll fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .step, .theme-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // Smooth scroll (ancres internes uniquement, jamais href="#" seul)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    a.addEventListener('click', e => {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Burger menu mobile ----
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    // Fermer quand on clique un lien
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Animated count-up stats ----
  const statEls = document.querySelectorAll('.stat[data-target]');
  if (statEls.length) {
    const countUp = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.querySelector('span').textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statsObs.observe(el));
  }

  // ---- Active nav link ----
  const curPath = window.location.pathname.replace(/\\/g, '/');
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    // Normalise le href pour comparaison
    const linkPath = new URL(href, window.location.href).pathname.replace(/\\/g, '/');
    if (curPath === linkPath) {
      link.classList.add('active');
    }
  });

  // ---- Back-to-top button ----
  const btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.setAttribute('aria-label', 'Retour en haut');
  btt.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 13 10 7 5 13"/></svg>';
  document.body.appendChild(btt);

  let bttTick = false;
  window.addEventListener('scroll', () => {
    if (bttTick) return;
    bttTick = true;
    requestAnimationFrame(() => {
      btt.classList.toggle('visible', window.scrollY > 400);
      bttTick = false;
    });
  }, { passive: true });

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
