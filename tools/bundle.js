// Składa src/js/*.js (w kolejności nazw) w js/bundle.js, który ładuje index.html.
// Aplikacja ładuje jeden skrypt, więc działa dokładnie tak jak przy jednym dużym pliku (deklaracje funkcji są "podnoszone" w całym kodzie,
// a asynchroniczne wywołania przy starcie nie ruszą przed załadowaniem reszty). Plik js/bundle.js jest generowany: nie edytuj go ręcznie.
// Uruchamiane automatycznie przez: npm start, npm run dist, npm run release, npm run check oraz w GitHub Actions.
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), srcDir = path.join(root, 'src', 'js'), out = path.join(root, 'js', 'bundle.js');
function sources() { return fs.readdirSync(srcDir).filter(f => f.endsWith('.js')).sort(); }
function text() { return '// PLIK GENEROWANY przez tools/bundle.js z src/js/*.js - nie edytuj go ręcznie.\n' + sources().map(f => '// ===== src/js/' + f + ' =====\n' + fs.readFileSync(path.join(srcDir, f), 'utf8')).join('\n'); }
function build() { const t = text(); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, t); return { files: sources(), bytes: t.length }; }
if (require.main === module) { const r = build(); console.log('js/bundle.js: ' + r.files.length + ' plików, ' + Math.round(r.bytes / 1024) + ' kB'); }
module.exports = { build, sources, srcDir, text };
