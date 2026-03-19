// ReviseTonBrevet — cookie-banner.js

(function () {
  if (localStorage.getItem('cookies_accepted')) return;

  // Chemin vers la politique selon la profondeur du fichier courant
  function getPolitiquePath() {
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/themes/')) return '../../pages/politique-confidentialite.html';
    if (path.includes('/pages/'))  return 'politique-confidentialite.html';
    return 'pages/politique-confidentialite.html';
  }

  // Styles injectés
  const style = document.createElement('style');
  style.textContent = `
    #cookie-banner {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 9999;
      background: #1e1b4b;
      color: #e0e7ff;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.2rem;
      flex-wrap: wrap;
      box-shadow: 0 -4px 24px rgba(0,0,0,.25);
      font-family: 'Nunito', sans-serif;
      font-size: .9rem;
      line-height: 1.5;
      animation: slideUpBanner .35s ease;
    }
    @keyframes slideUpBanner {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    #cookie-banner p {
      flex: 1;
      min-width: 220px;
      margin: 0;
    }
    #cookie-banner .cb-actions {
      display: flex;
      gap: .7rem;
      flex-shrink: 0;
    }
    #cookie-banner .cb-accept {
      background: #4f46e5;
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: .55rem 1.3rem;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: .9rem;
      cursor: pointer;
      transition: background .2s;
      white-space: nowrap;
    }
    #cookie-banner .cb-accept:hover { background: #4338ca; }
    #cookie-banner .cb-more {
      background: transparent;
      color: #a5b4fc;
      border: 1.5px solid #4f46e5;
      border-radius: 10px;
      padding: .5rem 1.1rem;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: .9rem;
      cursor: pointer;
      text-decoration: none;
      white-space: nowrap;
      transition: background .2s, color .2s;
    }
    #cookie-banner .cb-more:hover { background: #312e81; color: #fff; }
  `;
  document.head.appendChild(style);

  // Bandeau HTML
  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML = `
    <p>🍪 Pour financer notre plateforme gratuite et personnaliser ton parcours, nous utilisons des cookies (dont Google AdSense).</p>
    <div class="cb-actions">
      <button class="cb-accept" id="cb-accept-btn">J'accepte</button>
      <a class="cb-more" href="${getPolitiquePath()}">En savoir plus</a>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('cb-accept-btn').addEventListener('click', function () {
    localStorage.setItem('cookies_accepted', '1');
    banner.style.transition = 'opacity .3s ease, transform .3s ease';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => banner.remove(), 320);
  });
})();
