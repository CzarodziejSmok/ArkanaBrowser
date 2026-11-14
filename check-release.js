// Kontrola przed wydaniem. Uruchom: npm run check   (w GitHub Actions działa automatycznie z --ci)
// Pilnuje, żeby każda wersja była zgodna z instalatorem i automatycznymi aktualizacjami.
const fs = require('fs'), vm = require('vm'), path = require('path');
const ci = process.argv.includes('--ci'); let bad = 0;
const err = m => { console.error('✗ ' + m); bad++; }, ok = m => console.log('✓ ' + m);
const read = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const pk = JSON.parse(read('package.json')), html = read('index.html');
// kod źródłowy: src/js/*.js -> js/bundle.js (tools/bundle.js); index.html ładuje tylko js/preboot.js i js/bundle.js
const bundler = require('./tools/bundle.js'); bundler.build();
const srcList = bundler.sources().map(f => 'src/js/' + f), jsList = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const jsAll = srcList.map(f => read(f)).join('\n');
// 1) wersje: package.json (x.y.z) = const VERSION='vX' w index.html = nagłówek README
if (!/^\d+\.\d+\.\d+$/.test(pk.version)) err('version w package.json musi mieć postać x.y.z, jest: ' + pk.version); else ok('package.json version ' + pk.version);
const major = String(pk.version).split('.')[0], vm1 = jsAll.match(/const VERSION='v(\d+)'/);
if (!vm1 || vm1[1] !== major) err(`VERSION w index.html (${vm1 ? 'v' + vm1[1] : 'brak'}) nie zgadza się z wersją ${pk.version}`); else ok('VERSION w index.html zgodna');
if (!new RegExp('^# Arkana Browser v' + major + '\\b').test(read('README.md'))) err('nagłówek README.md powinien zaczynać się od „# Arkana Browser v' + major + '”'); else ok('README zgodny');
// 2) pakowanie: każdy plik wymagany przez kod musi być na liście build.files
const files = (pk.build && pk.build.files) || [], need = new Set(['main.js', 'preload.js', 'index.html', 'package.json', 'CHANGELOG.txt', 'css/app.css', 'js/preboot.js', 'js/bundle.js', 'wv-preload.js']);
const packed = f => files.includes(f) || files.some(p => p.endsWith('/**/*') && f.startsWith(p.slice(0, -4)));
for (const f of ['main.js', 'updater.js']) for (const m of read(f).matchAll(/require\('\.\/([\w.-]+)'\)/g)) need.add(m[1].endsWith('.js') || m[1].endsWith('.json') ? m[1] : m[1] + '.js');
for (const f of need) { if (!fs.existsSync(path.join(__dirname, f))) err('brak pliku ' + f); else if (!packed(f)) err(f + ' nie jest na liście build.files w package.json (instalator go pominie!)'); }
if (!bad) ok('lista build.files zawiera wszystkie wymagane pliki');
// 2b) CHANGELOG.txt: nagłówki wersji (linie = niewydane, linie * wydane; wersje w postaci v34 lub v31.0, v31.1) i wpis dla bieżącej wersji
{ const cl = read('CHANGELOG.txt').replace(/\r/g, '').split('\n'), vs = [], sp = /^([=*])\1{9,}\s*$/;
  for (let i = 0; i + 2 < cl.length; i++) if (sp.test(cl[i]) && cl[i + 1].trim() && sp.test(cl[i + 2]) && cl[i][0] === cl[i + 2][0]) { const m = cl[i + 1].trim().match(/^((?:v?\d+(?:\.\d+)*)(?:\s*,\s*v?\d+(?:\.\d+)*)*)/); if (m) vs.push({ v: m[1].split(/\s*,\s*/).map(x => x.replace(/^v/i, '')), rel: cl[i][0] === '*' }); }
  const [x, y, z] = pk.version.split('.'), cand = [pk.version, +z ? '' : x + '.' + y, +y || +z ? '' : x].filter(Boolean);
  if (!vs.length) err('CHANGELOG.txt: brak nagłówków wersji'); else if (!vs.some(e => e.v.some(q => cand.includes(q)))) err('CHANGELOG.txt: brak wpisu dla wersji v' + (+y || +z ? x + '.' + y + (+z ? '.' + z : '') : x) + ' (wklej wpis z odpowiedzi)'); else ok('CHANGELOG.txt: ' + vs.length + ' wpisów (' + vs.filter(e => e.rel).length + ' wydanych), jest wpis dla bieżącej wersji'); }
// 3) składnia
for (const f of fs.readdirSync(__dirname).filter(x => x.endsWith('.js') && x !== 'check-release.js')) { try { new vm.Script(read(f), { filename: f }); } catch (e) { err('składnia ' + f + ': ' + e.message); } }
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
for (const f of [...srcList, 'js/preboot.js']) { try { new vm.Script(read(f), { filename: f }); } catch (e) { err('składnia ' + f + ': ' + e.message); } }
if (JSON.stringify(jsList) !== JSON.stringify(['js/preboot.js', 'js/bundle.js'])) err('index.html powinien ładować tylko js/preboot.js i js/bundle.js, jest: ' + jsList.join(', '));
if (blocks.length) err('index.html zawiera skrypt wbudowany (CSP go zablokuje): przenieś do js/'); if (/\son[a-z]+\s*=\s*["']/i.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) err('index.html zawiera wbudowany handler zdarzenia (onclick=...), CSP go zablokuje');
if (!/http-equiv="Content-Security-Policy"[^>]*script-src 'self'/.test(html)) err("brak polityki CSP z script-src 'self' w index.html");
if (!bad) ok('składnia plików .js, CSP i index.html');
// 4) tłumaczenia i nazwy globalne
const js = jsAll, i0 = js.indexOf('const LROWS=[['), j0 = js.indexOf(']];', i0) + 2;
try {
  const rows = eval(js.slice(i0 + 'const LROWS='.length, j0)), keys = rows.map(r => r[0]), ph = c => (String(c).match(/\{\w+\}/g) || []).sort().join();
  if (!rows.every(r => r.length === 8)) err('LROWS: każdy wiersz musi mieć 8 kolumn');
  if (rows.flat().some(c => !String(c).trim())) err('LROWS: puste pole');
  const d = keys.filter((k, i) => keys.indexOf(k) !== i); if (d.length) err('LROWS: zduplikowane klucze: ' + [...new Set(d)].join(' | '));
  const pm = rows.filter(r => r.some(c => ph(c) !== ph(r[0]))).map(r => r[0]); if (pm.length) err('LROWS: niezgodne {placeholdery}: ' + pm.join(' | '));
  ok('tłumaczenia: ' + rows.length + ' wierszy');
} catch (e) { err('LROWS: ' + e.message); }
const names = [...js.matchAll(/^(?:const|let|function|class|async function)\s+([A-Za-z_$][\w$]*)/gm)].map(m => m[1]), dn = [...new Set(names.filter((n, i) => names.indexOf(n) !== i))];
if (dn.length) err('zduplikowane nazwy globalne: ' + dn.join(', ')); else ok('brak kolizji nazw globalnych');
// 5) most preload ↔ proces główny
const pre = read('preload.js'), main = ['main.js', 'updater.js', 'permissions.js', 'vault.js'].map(read).join('\n');
const miss = [...pre.matchAll(/ipcRenderer\.(?:invoke|send)\('([\w-]+)'/g)].map(m => m[1]).filter(c => !main.includes("'" + c + "'")); if (miss.length) err('kanały bez obsługi w main/updater: ' + miss.join(', ')); else ok('kanały IPC mają obsługę');
// 6) konfiguracja repozytorium (tylko w CI)
const pub = [].concat((pk.build && pk.build.publish) || []).find(p => p.provider === 'github');
if (!pub) err('brak build.publish (provider github)'); else if (/^(TWOJ|YOUR|OWNER)/i.test(pub.owner)) { (ci ? err : console.warn)('! build.publish.owner nadal ma wartość zastępczą: ' + pub.owner); } else ok('repozytorium: ' + pub.owner + '/' + pub.repo);
if (bad) { console.error(`\nZnaleziono błędów: ${bad}. Popraw je przed wydaniem.`); process.exit(1); } console.log('\nWszystko gotowe do wydania wersji v' + pk.version + '.');
