const fs = require('fs');
const path = require('path');

const files = {
  maths: ['calcul', 'geometrie', 'fonctions', 'stats', 'equations'],
  francais: ['grammaire', 'figures', 'redaction', 'lecture', 'orthographe'],
  'histoire-geo': ['ww1', 'ww2', 'veme', 'mondialisation', 'developpement'],
  svt: ['corps-humain', 'genetique', 'ecologie', 'reproduction', 'microbiologie'],
  'physique-chimie': ['mecanique', 'electricite', 'chimie', 'optique', 'energie']
};

const result = {};

for (const [matiere, themes] of Object.entries(files)) {
  result[matiere] = {};
  for (const theme of themes) {
    const filePath = path.join(__dirname, 'themes', matiere, `${theme}.html`);
    const html = fs.readFileSync(filePath, 'utf8');
    // Extract content between initQCM([ and ]);
    const match = html.match(/initQCM\(\s*(\[[\s\S]*?\])\s*\);/);
    if (!match) {
      console.error(`No QCM found in ${filePath}`);
      result[matiere][theme] = [];
      continue;
    }
    try {
      const questions = eval(match[1]);
      result[matiere][theme] = questions;
      console.log(`✓ ${matiere}/${theme}: ${questions.length} questions`);
    } catch (e) {
      console.error(`Error parsing ${matiere}/${theme}:`, e.message);
      result[matiere][theme] = [];
    }
  }
}

fs.writeFileSync(
  path.join(__dirname, 'qcm_all.json'),
  JSON.stringify(result, null, 2),
  'utf8'
);
console.log('\n✅ qcm_all.json généré !');
