// ReviseTonBrevet — lightbox.js
// Clic sur .vis svg → zoom plein écran

(function () {
  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const box = document.createElement('div');
  box.className = 'lb-box';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lb-close';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Fermer');

  const svgWrap = document.createElement('div');
  const caption = document.createElement('div');
  caption.className = 'lb-caption';

  box.appendChild(closeBtn);
  box.appendChild(svgWrap);
  box.appendChild(caption);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  function open(svgEl, captionText) {
    svgWrap.innerHTML = '';
    svgWrap.appendChild(svgEl.cloneNode(true));
    caption.textContent = captionText || '';
    caption.style.display = captionText ? 'block' : 'none';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.vis').forEach(function (vis) {
      const svg = vis.querySelector('svg');
      if (!svg) return;

      // Trouver la légende la plus proche
      const captionEl = vis.querySelector('.vis-caption') ||
                        vis.nextElementSibling?.classList?.contains('vis-caption') && vis.nextElementSibling;
      const captionText = captionEl ? captionEl.textContent.trim() : '';

      // Ajouter hint "Cliquer pour agrandir"
      const hint = document.createElement('span');
      hint.className = 'vis-hint';
      hint.textContent = '🔍 Cliquer pour agrandir';
      vis.after(hint);

      svg.addEventListener('click', function () { open(svg, captionText); });
    });
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  box.addEventListener('click', function (e) { e.stopPropagation(); });
})();
