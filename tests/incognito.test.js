'use strict';
// Okno incognito: napis z własnych liter, tylko ikona incognito na kartach, bardziej wyszarzałe okno i wolniejsze efekty tła.
const { eq, ok } = require('./helpers'), fs = require('fs'), path = require('path'), vm = require('vm');
const rd = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8').replace(/\r\n/g, '\n');
const slice = (s, a, b) => { const i = s.indexOf(a), j = b ? s.indexOf(b, i) : s.length; if (i < 0 || j < 0) throw new Error('brak fragmentu: ' + a); return s.slice(i, j); };
module.exports = async () => {
  // ---- napis ----
  const w = rd('src/js/29-windows.js'), ctx = { Math }; vm.createContext(ctx); vm.runInContext(slice(w, 'function incWordSvg', '// iskra Arkany') + ';globalThis.svg=incWordSvg();', ctx); const svg = ctx.svg;
  const groups = [...svg.matchAll(/<g class="(iw[12])">/g)].map(m => m[1]);
  eq(groups, ['iw1', 'iw1', 'iw2', 'iw2', 'iw2', 'iw2', 'iw2', 'iw2', 'iw2'], 'dziewięć liter „inCognito”: „in” jasne, „Cognito” szare');
  ok(!/<text|font-|<use/.test(svg), 'litery to własne kształty, nie czcionka'); ok(/aria-label="Incognito"/.test(svg), 'napis ma opis dla czytników ekranu');
  const vb = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const gs = [...svg.matchAll(/<g class="iw[12]">(.*?)<\/g>/g)].map(m => m[1]);
  ok(gs.every(g => /<path|<circle/.test(g)), 'każda litera ma kształty'); ok(!/NaN|undefined/.test(svg), 'brak błędnych liczb w ścieżkach');
  // wielka litera C: wyższa niż małe litery (y od 0 do 15), pierścień o zewnętrznym promieniu 7,5
  const C = gs[2]; ok(/A7\.5 7\.5 0 1 0/.test(C), 'litera C: łuk o zewnętrznym promieniu 7,5 (wielka litera, wysokość 15)');
  const o1 = gs[3]; ok(/class="st" cx="[\d.]+" cy="9" r="4\.4"/.test(o1), 'małe „o”: wysokość 12 (niższe od wielkiego C)');
  // odstępy: środki obu liter „o” leżą bliżej niż dawniej (12 + 2,2), a okrągłe litery lekko na siebie zachodzą
  const cxs = [...svg.matchAll(/class="st" cx="([\d.]+)" cy="9"/g)].map(m => +m[1]); ok(cxs.length === 3, 'trzy okrągłe litery: o, g, o');
  ok(cxs[1] - cxs[0] < 12, 'o i g zachodzą na siebie (odległość środków < szerokość litery 12)'); 
  const full = [...svg.matchAll(/<g class="(?:iw1|iw2)">/g)].length; eq(full, 9, 'dziewięć grup');
  ok(vb[2] < 100, 'napis jest zwarty (szerokość viewBox ' + vb[2] + ' < 100; wcześniej ponad 106)');
  // zaokrąglone krawędzie: i, n (góra), t (góra i boki poprzeczki) – ścieżki z łukami Q w narożnikach
  const iq = (gs[0].match(/Q/g) || []).length; ok(iq >= 4, 'litera „i”: cztery zaokrąglone narożniki kreski'); ok((gs[1].match(/Q/g) || []).length >= 4, 'litera „n”: zaokrąglona góra i stopki');
  const t = gs[7]; ok((t.match(/Q/g) || []).length >= 8, 'litera „t”: zaokrąglone narożniki kreski i obu końców poprzeczki');
  ok(!/stroke-linecap/.test(svg), 'końce nie są „zawinięte” – zaokrąglenie to spójny, mały promień narożników');
  // połysk: gradienty w pionie dla obu kolorów, z miękkim uskokiem
  ok(/<linearGradient id="iwg1"[^>]*y1="3"[^>]*y2="15"/.test(svg) && /<linearGradient id="iwg2"/.test(svg), 'gradienty połysku dla „in” i „Cognito”');
  const stops = id => [...svg.match(new RegExp('<linearGradient id="' + id + '"[\\s\\S]*?</linearGradient>'))[0].matchAll(/offset="([\d.]+)" stop-color="(#[0-9a-f]{6})"/g)].map(m => [+m[1], m[2]]);
  const lum = h => { const v = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16)); return (v[0] + v[1] + v[2]) / 3; };
  for (const id of ['iwg1', 'iwg2']) { const st = stops(id); ok(st.length >= 4 && st.every((x, i) => i === 0 || lum(x[1]) <= lum(st[i - 1][1])), id + ': jasność maleje od góry do dołu (połysk)'); ok(lum(st[0][1]) - lum(st[st.length - 1][1]) > 20, id + ': widoczna różnica barwy góra–dół'); }
  ok(lum(stops('iwg1')[1][1]) > 225 && lum(stops('iwg2')[1][1]) < 170, '„in” nadal prawie białe, „Cognito” wyraźnie szare');
  const css = rd('css/app.css'); ok(/\.iw \.iw1\{fill:url\(#iwg1\)\}\.iw \.iw2\{fill:url\(#iwg2\)\}/.test(css) && /\.iw \.iw1 \.st\{stroke:url\(#iwg1\)\}/.test(css), 'style: wypełnienia gradientem (także kreski łuków)'); ok(/\.iw \.ip\{fill:var\(--incdot,#e8825a\)\}/.test(css), 'kropka bierze kolor ze zmiennej --incdot'); ok(!/#logo \.incw small/.test(css), 'stary napis z czcionki usunięty');
  ok(/incWordSvg\(\)/.test(rd('src/js/22-logo.js')) && !/<small>Incognito/.test(rd('src/js/22-logo.js')), 'logo w oknie incognito używa nowego napisu');
  // kropka: kolor motywu o stałej jasności i nasyceniu
  { const st9 = rd('src/js/09-settings.js'), helpers = ['const clamp=', 'function hsl2rgb', 'const hex=', 'const unhex='].map(k => { const i = st9.indexOf(k); return st9.slice(i, st9.indexOf('\n', i)); }).join('\n') + '\n' + slice(st9, 'function rgb2hsl', 'const hex=');
    const i0 = st9.indexOf('{ const d=rgb2hsl(232,130,90)'), code = st9.slice(i0, st9.indexOf('); }', i0) + 4);
    const dot = acc => { const props = {}; const c = { st: { acc }, r: { setProperty: (k, v) => { props[k] = v; } } }; vm.createContext(c); vm.runInContext(helpers + '\n' + code, c); return props['--incdot']; };
    const hsl = h => { const c = unhexT(h); return c; }; const unhexT = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16));
    const hs = h => { const [r, g, b] = unhexT(h).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let H = 0; if (d) { H = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; H = (H * 60 + 360) % 360; } const S = d ? d / (1 - Math.abs(2 * l - 1)) * 100 : 0; return [H, S, l * 100]; };
    const base = hs(dot('#e8825a')); ok(Math.abs(base[0] - 16) < 4 && base[1] > 70 && base[2] > 58 && base[2] < 70, 'domyślny motyw: kropka jak dotychczasowy pomarańcz (' + dot('#e8825a') + ')');
    for (const [acc, hue] of [['#5aa9e8', 208], ['#7fc97f', 120], ['#e06ba8', 330], ['#9b8cf0', 250]]) { const q = hs(dot(acc)), a = hs(acc); ok(Math.abs(q[0] - a[0]) < 4, 'kropka ma odcień wybranego motywu ' + acc + ' → ' + dot(acc)); ok(Math.abs(q[1] - base[1]) < 6 && Math.abs(q[2] - base[2]) < 3, 'kropka ma stałą jasność i nasycenie (' + acc + ')'); }
    const grey = hs(dot('#808080')); ok(Math.abs(grey[0] - base[0]) < 4, 'motyw bez odcienia (szary): kropka zostaje pomarańczowa'); }
  // ---- karty ----
  const tabs = rd('src/js/07-tabs.js'), fn = slice(tabs, 'function tabHtml', '// przypięte karty');
  const mk = INC => { const c = { INC, esc: s => String(s), host: u => u, entering: new Set(), leaving: new Set(), dragId: null, dragGone: false, GP_IC: '', incHatSvg: () => '<svg class="incg"></svg>' }; vm.createContext(c); vm.runInContext(fn + ';globalThis.h=tabHtml;', c); return c.h; };
  const tab = { id: 'a', url: 'https://x.pl', title: 'X', icon: 'https://x.pl/f.ico' }, f = { active: 'a' };
  for (const pin of [false, true]) { const h = mk(true)(tab, f, pin, false), h2 = mk(true)({ ...tab, icon: '' }, f, pin, false);
    ok(h.includes('class="incg"') && !h.includes('<img') && !h.includes('✺') && !h2.includes('✺'), 'incognito' + (pin ? ' (przypięta)' : '') + ': tylko ikona incognito, bez ikony strony i iskry');
    const n = mk(false)(tab, f, pin, false), n2 = mk(false)({ ...tab, icon: '' }, f, pin, false); ok(n.includes('<img') && !n.includes('incg') && n2.includes('✺'), 'zwykłe okno bez zmian' + (pin ? ' (przypięta)' : '')); }
  // ---- wyszarzenie ----
  const st = rd('src/js/09-settings.js'); ok(/if\(INC\)\{ s\*=\.18;/.test(st) && /q\[1\]\*\.22/.test(st) && /INC\?'#ececef'/.test(st), 'okno incognito: mniejsze nasycenie tła i akcentu, neutralny tekst');
  // ---- spowolnienie efektów ----
  const p = rd('src/js/08-panel.js'), clk = slice(p, 'const INC_SLOW', 'function draw(');
  const run = INC => { const c = { INC, last: 0, Math }; vm.createContext(c); vm.runInContext(clk + ';globalThis.k=bgClock;globalThis.S=INC_SLOW;', c); return c; };
  { const c = run(false); let o = c.k(1000); eq([o.t, o.dt], [1000, 50], 'zwykłe okno: czas efektów bez zmian'); o = c.k(1030); eq([o.t, o.dt], [1030, 30], 'zwykłe okno: kolejna klatka bez zmian'); }
  { const c = run(true); let o = c.k(1000), t1 = o.t; o = c.k(1030); const o2 = c.k(1060), o3 = c.k(1090);
    ok(Math.abs((o3.t - t1) - 90 * c.S) < 1e-9, 'incognito: efekty płyną ' + c.S + ' razy wolniej'); eq(o.dt, 30 * c.S, 'incognito: krok czasu też zwolniony'); ok(c.S <= .35, 'spowolnienie jest wyraźne (co najmniej ok. 3 razy)'); }
  ok(/\*\(INC\?INC_SLOW:1\)/.test(rd('src/js/17-app-translate.js')), 'cząsteczki w oknach aplikacji też zwolnione w incognito');
  ok(/const bc=bgClock\(t0\), t=bc\.t, dt=bc\.dt;/.test(p), 'rysowanie tła używa zwolnionego zegara');
};
