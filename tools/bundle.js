// Składa src/js/*.js (w kolejności nazw) w js/bundle.js, który ładuje index.html.
// Aplikacja ładuje jeden skrypt, więc działa dokładnie tak jak przy jednym dużym pliku (deklaracje funkcji są "podnoszone" w całym kodzie,
// a asynchroniczne wywołania przy starcie nie ruszą przed załadowaniem reszty). Plik js/bundle.js jest generowany: nie edytuj go ręcznie.
// Uruchamiane automatycznie przez: npm start, npm run dist, npm run release, npm run check oraz w GitHub Actions.
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), srcDir = path.join(root, 'src', 'js'), out = path.join(root, 'js', 'bundle.js');
// v49.9: moduł aplikacji (panel aplikacji i gry) to osobny plik js/apps.js, wczytywany dopiero po włączeniu modułu (src/js/25-modules.js). Pliki modułu wymienia ta lista;
// dzielą z rdzeniem zasięg globalny (const/let/function z jednego skryptu są widoczne w drugim), więc kod źródłowy nie wymaga zmian. Rdzeń nie może używać niczego z modułu przy ładowaniu.
const APPS = ['10-app-gejos.js', '11-app-windows.js', '12-app-calc.js', '13-app-notes.js', '14-app-clock.js', '15-app-conv.js', '17-app-translate.js', '18-app-dice.js', '19-games.js', '20-app-files.js'];
const STUBS = ['renderBar', 'renderApps', 'toggleAdd', 'openApp'];   // zaślepki w rdzeniu (25-modules.js), które plik modułu po wczytaniu zastępuje funkcjami o tej samej nazwie
const outApps = path.join(root, 'js', 'apps.js');
function sources() { return fs.readdirSync(srcDir).filter(f => f.endsWith('.js')).sort(); }
const coreSources = () => sources().filter(f => !APPS.includes(f)), appSources = () => sources().filter(f => APPS.includes(f));
const join = (head, list) => head + list.map(f => '// ===== src/js/' + f + ' =====\n' + fs.readFileSync(path.join(srcDir, f), 'utf8')).join('\n');
function text() { return join('// PLIK GENEROWANY przez tools/bundle.js z src/js/*.js (rdzeń) - nie edytuj go ręcznie.\n', coreSources()); }
function appsText() { return join('// PLIK GENEROWANY przez tools/bundle.js z src/js/*.js (moduł aplikacji) - nie edytuj go ręcznie.\n', appSources()); }
function build() { const t = text(), a = appsText(); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, t); fs.writeFileSync(outApps, a); return { files: sources(), bytes: t.length + a.length, core: t.length, apps: a.length }; }
if (require.main === module) { const r = build(); console.log('js/bundle.js: ' + r.files.length + ' plików, ' + Math.round(r.bytes / 1024) + ' kB'); }
module.exports = { build, sources, coreSources, appSources, srcDir, text, appsText, APPS, STUBS };
