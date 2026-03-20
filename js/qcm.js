// ReviseTonBrevet — qcm.js (Duolingo style)

let _questions = [];
let _current   = 0;
let _score     = 0;

function initQCM(questions) {
  _questions = questions;
  _current   = 0;
  _score     = 0;

  // Cacher la section QCM au départ
  const qcmSection = document.querySelector('.qcm-section');
  qcmSection.style.display = 'none';

  // Bouton "Lancer le QCM" en bas de la fiche
  const ficheSection = document.querySelector('.fiche-section');
  const btnWrap = document.createElement('div');
  btnWrap.className = 'qcm-launch-wrap';
  btnWrap.innerHTML = `
    <div class="qcm-launch-card">
      <div>
        <div class="qcm-launch-title">Teste tes connaissances</div>
        <div class="qcm-launch-meta">
          <span>📝 ${questions.length} questions</span>
          <span>⚡ ~${Math.ceil(questions.length * 0.75)} min</span>
          <span>✅ Corrigé instantanément</span>
        </div>
      </div>
      <button class="qcm-launch-btn" id="qcm-launch-btn">Lancer le QCM →</button>
    </div>
  `;
  ficheSection.appendChild(btnWrap);
  btnWrap.querySelector('#qcm-launch-btn').addEventListener('click', lancerQCM);

  // Construire la structure Duolingo dans #qcm
  const container = document.getElementById('qcm');
  container.innerHTML = `
    <div class="qcm-inner">
      <div class="qcm-top">
        <div class="qcm-progress-wrap">
          <div class="qcm-progress-fill" id="qcm-progress-fill" style="width:0%"></div>
        </div>
        <div class="qcm-counter" id="qcm-counter">1 / ${questions.length}</div>
      </div>
      <div class="qcm-card" id="qcm-card"></div>
    </div>
  `;
}

function showQuestion(index) {
  const q     = _questions[index];
  const total = _questions.length;

  document.getElementById('qcm-progress-fill').style.width = `${(index / total) * 100}%`;
  document.getElementById('qcm-counter').textContent = `${index + 1} / ${total}`;

  const card = document.getElementById('qcm-card');

  // Construire le DOM sans innerHTML pour les données
  const questionDiv = document.createElement('div');
  questionDiv.className = 'question-text';
  questionDiv.textContent = q.q;

  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'options';
  optionsDiv.id = 'options';

  q.options.forEach((opt, j) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => repondre(j, q.correct));
    optionsDiv.appendChild(btn);
  });

  const explDiv = document.createElement('div');
  explDiv.className = 'explication';
  explDiv.id = 'explication';
  explDiv.textContent = '💡 ' + q.explication;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn-next';
  nextBtn.id = 'btn-next';
  nextBtn.textContent = index + 1 < total ? 'Question suivante →' : 'Voir mon score 🏆';
  nextBtn.addEventListener('click', nextQuestion);

  card.innerHTML = '';
  card.appendChild(questionDiv);
  card.appendChild(optionsDiv);
  card.appendChild(explDiv);
  card.appendChild(nextBtn);

  // Animation d'entrée
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'fadeInCard .35s ease';
}

function repondre(chosen, correct) {
  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach(btn => btn.disabled = true);

  buttons[correct].classList.add('correct');
  if (chosen !== correct) {
    buttons[chosen].classList.add('wrong');
  } else {
    _score++;
  }

  document.getElementById('explication').classList.add('visible');
  document.getElementById('btn-next').classList.add('visible');
}

function nextQuestion() {
  _current++;
  if (_current < _questions.length) {
    showQuestion(_current);
  } else {
    showResult();
  }
}

function showResult() {
  const total    = _questions.length;
  const pct      = Math.round((_score / total) * 100);
  const nextPage = document.querySelector('.qcm-section').dataset.next || '../../index.html';

  document.getElementById('qcm-progress-fill').style.width = '100%';

  let emoji, msg;
  if (_score <= Math.floor(total * .25))      { emoji = '😬'; msg = "C'est un début… relis la fiche et retente !"; }
  else if (_score <= Math.floor(total * .5))  { emoji = '📖'; msg = "La moitié ! Relis les points ratés, tu vas y arriver."; }
  else if (_score <= Math.floor(total * .75)) { emoji = '👏'; msg = "Beau travail ! Encore un effort pour être imbattable."; }
  else if (_score < total)                    { emoji = '🔥'; msg = "Excellent ! Presque parfait, tu es prêt(e) pour le brevet !"; }
  else                                        { emoji = '🏆'; msg = "PARFAIT ! 20/20 — Tu maîtrises ce thème à 100% !"; }

  document.getElementById('qcm').style.display = 'none';
  const resultEl = document.getElementById('result');
  resultEl.classList.remove('hidden');

  const resultEmoji  = document.createElement('div'); resultEmoji.className  = 'result-emoji';  resultEmoji.textContent = emoji;
  const resultScore  = document.createElement('div'); resultScore.className  = 'result-score';
  const scoreSpan    = document.createElement('span'); scoreSpan.textContent = ` / ${total}`;
  resultScore.textContent = _score; resultScore.appendChild(scoreSpan);
  const resultPct    = document.createElement('div'); resultPct.className    = 'result-pct';    resultPct.textContent = pct + '%';
  const resultMsg    = document.createElement('p');   resultMsg.className    = 'result-msg';    resultMsg.textContent = msg;
  const resetBtn     = document.createElement('button');
  resetBtn.className = 'btn-next visible';
  resetBtn.style.marginTop = '1.5rem';
  resetBtn.textContent = '🔄 Recommencer';
  resetBtn.addEventListener('click', resetQCM);

  resultEl.innerHTML = '';
  resultEl.appendChild(resultEmoji);
  resultEl.appendChild(resultScore);
  resultEl.appendChild(resultPct);
  resultEl.appendChild(resultMsg);
  resultEl.appendChild(resetBtn);

  if (_score === total) {
    const nextLink = document.createElement('a');
    nextLink.href = nextPage;
    nextLink.className = 'btn-next-link';
    nextLink.textContent = 'Thème suivant →';
    resultEl.appendChild(nextLink);
  }
}

function lancerQCM() {
  document.querySelector('.qcm-launch-wrap').style.display = 'none';
  const qcmSection = document.querySelector('.qcm-section');
  qcmSection.style.display  = 'flex';
  qcmSection.style.opacity  = '0';
  qcmSection.style.transition = 'opacity .4s ease';
  requestAnimationFrame(() => { qcmSection.style.opacity = '1'; });
  setTimeout(() => qcmSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  showQuestion(0);
}

function resetQCM() { location.reload(); }
