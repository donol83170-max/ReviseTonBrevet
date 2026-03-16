// ReviseTonBrevet — qcm.js

function initQCM(questions) {
  const container = document.getElementById('qcm-container');
  if (!container) return;

  let score = 0;
  let answered = 0;
  const total = questions.length;

  questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'qcm-question';
    div.innerHTML = `
      <div class="q-num">Question ${i + 1} / ${total}</div>
      <h4>${q.q}</h4>
      ${q.exemple ? `<div class="qcm-exemple">📌 ${q.exemple}</div>` : ''}
      <div class="qcm-options">
        ${q.options.map((opt, j) => `
          <button class="qcm-option" data-index="${j}" onclick="repondre(this, ${i}, ${j})">${opt}</button>
        `).join('')}
      </div>
      <div class="qcm-explication" id="exp-${i}">💡 ${q.explication}</div>
    `;
    container.appendChild(div);
  });

  const scoreDiv = document.createElement('div');
  scoreDiv.className = 'qcm-score';
  scoreDiv.id = 'qcm-score';
  scoreDiv.innerHTML = `
    <h3 id="score-text"></h3>
    <p id="score-msg"></p>
    <button id="btn-recommencer" onclick="recommencer()">🔄 Recommencer</button>
  `;
  container.appendChild(scoreDiv);

  window._qcmQuestions = questions;
  window._qcmScore = 0;
  window._qcmAnswered = 0;
}

function repondre(btn, questionIndex, optionIndex) {
  const q = window._qcmQuestions[questionIndex];
  const questionDiv = btn.closest('.qcm-question');
  const allBtns = questionDiv.querySelectorAll('.qcm-option');

  allBtns.forEach(b => { b.disabled = true; });

  if (optionIndex === q.correct) {
    btn.classList.add('correct');
    window._qcmScore++;
  } else {
    btn.classList.add('incorrect');
    allBtns[q.correct].classList.add('correct');
  }

  const exp = document.getElementById(`exp-${questionIndex}`);
  if (exp) exp.classList.add('visible');

  window._qcmAnswered++;
  if (window._qcmAnswered === window._qcmQuestions.length) {
    afficherScore();
  }
}

function afficherScore() {
  const scoreDiv = document.getElementById('qcm-score');
  const total = window._qcmQuestions.length;
  const s = window._qcmScore;
  scoreDiv.style.display = 'block';
  scoreDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

  document.getElementById('score-text').textContent = `${s} / ${total}`;

  let msg = '';
  const pct = s / total;
  if (pct === 1)       msg = '🏆 Parfait ! Tu maîtrises ce thème.';
  else if (pct >= .8)  msg = '🎯 Très bien ! Encore un peu de révision.';
  else if (pct >= .6)  msg = '👍 Pas mal ! Relis la fiche de cours.';
  else if (pct >= .4)  msg = '📖 Continue à réviser, tu vas y arriver !';
  else                 msg = '💪 Relis bien la fiche, tu vas progresser !';

  document.getElementById('score-msg').textContent = msg;
}

function recommencer() {
  const container = document.getElementById('qcm-container');
  container.innerHTML = '';
  window._qcmScore = 0;
  window._qcmAnswered = 0;
  initQCM(window._qcmQuestions);
}
