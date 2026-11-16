'use strict';
// Ikona na pasku zadań: włączanie i wyłączanie opcji „Ikona aplikacji w kolorach motywu” działa od razu w obie strony, a po wyłączeniu wraca ORYGINALNA ikona.
const { eq, ok } = require('./helpers'), fs = require('fs'), path = require('path'), vm = require('vm');
const main = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8').replace(/\r\n/g, '\n');
const slice = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('brak fragmentu: ' + a); return main.slice(i, j); };
module.exports = async () => {
  ok(!/themedOn|staticFlag/.test(main.replace(/\/\/.*$/gm, '')), 'nie ma już przełącznika, który działał dopiero po restarcie');
  const timers = []; const mkWin = n => ({ id: n, icons: [], setIcon(i) { this.icons.push(i); }, isDestroyed: () => false, appDetails: null, setAppDetails(d) { this.appDetails = d; } });
  const w1 = mkWin(1), w2 = mkWin(2), inc = mkWin(3); const calls = { apply: [], restore: 0 };
  const themed = { name: 'motyw', isEmpty: () => false }, base = { name: 'oryginał', isEmpty: () => false };
  const mk = (baseOk = true) => ({
    ipcMain: { on(ch, f) { this.h = f; } }, winOf: () => w1, nativeImage: { createFromDataURL: u => (u ? themed : { isEmpty: () => true }), createFromPath: () => (baseOk ? base : { isEmpty: () => true }), createFromBuffer: () => ({ isEmpty: () => true }) },
    ICON: 'icon.ico', __dirname: '/x', fs: { readFileSync() { throw new Error('x'); }, unlinkSync() {} }, path, process: { platform: 'win32' }, incWins: new Set([inc]), BrowserWindow: { getAllWindows: () => [w1, w2, inc] },
    WeakMap, setTimeout: f => { timers.push(f); return timers.length; }, clearTimeout() {}, console,
    tbar: { applyThemeIcon: o => { calls.apply.push(o.img); return { updated: 0 }; }, restoreIcon: () => { calls.restore++; }, notifyShell() {} }, shell: {}, app: { getPath: () => 'C:\\a', getAppPath: () => 'C:\\app', isPackaged: true }, baseData: 'C:\\d', execFile() {}, baseIconHolder: null });
  const code = slice("const icoTimers = new WeakMap();", "// ---- logowanie Google");
  const baseFn = slice('function baseIcon()', 'function pinnedAumid');
  const ctx = mk(); vm.createContext(ctx); vm.runInContext(baseFn + code, ctx);
  const run = async (url, on) => { timers.length = 0; ctx.ipcMain.h({ sender: {} }, url, on); while (timers.length) timers.shift()(); };
  const last = w => w.icons[w.icons.length - 1];
  await run('data:image/png;base64,AAA', true); eq([last(w1), last(w2), last(inc)], [themed, themed, undefined], 'włączona: ikona w kolorach motywu we wszystkich zwykłych oknach (incognito ma własną)'); eq([calls.apply.length, calls.restore], [1, 0], 'włączona: ikona przypiętego skrótu w kolorach motywu');
  await run('data:image/png;base64,AAA', false); eq([last(w1), last(w2)], [base, base], 'wyłączona: oryginalna ikona programu (a nie narysowana w kolorach motywu)'); eq(calls.restore, 1, 'wyłączona: przypięty skrót wraca do ikony programu');
  await run('', false); eq(last(w1), base, 'wyłączona: nie zależy od tego, co wyśle okno');
  await run('data:image/png;base64,AAA', true); eq([last(w1), last(w2), calls.apply.length], [themed, themed, 2], 'ponowne włączenie: kolor motywu wraca od razu, bez restartu');
  { const w = mkWin(9); w.icons.push('stara'); const c2 = mk(false); c2.winOf = () => w; c2.BrowserWindow = { getAllWindows: () => [w] }; vm.createContext(c2); vm.runInContext(baseFn + code, c2); c2.ipcMain.h({ sender: {} }, '', false); eq(w.icons, ['stara'], 'gdy nie da się wczytać oryginalnej ikony, nic nie zmieniamy'); }
  { const iw = inc; iw.icons.length = 0; const c4 = mk(); c4.winOf = () => iw; c4.BrowserWindow = { getAllWindows: () => [iw] }; vm.createContext(c4); vm.runInContext(baseFn + code, c4); c4.ipcMain.h({ sender: {} }, 'data:image/png;base64,AAA', false); eq(iw.icons, [themed], 'okno incognito zachowuje własną (szarą) ikonę także przy wyłączonej opcji'); }
  // identyfikator grupy okna: zawsze ten sam, niezależnie od opcji
  const fn = slice('function applyTaskbar', '// ---- sesje'); const c3 = { process: { platform: 'win32' }, incWins: new Set([inc]), THEMED_ID: 'com.arkana.browser.themed', pinnedAumid: () => '', console }; vm.createContext(c3); vm.runInContext(fn, c3);
  const a = mkWin(5); c3.applyTaskbar(a); eq(a.appDetails.appId, 'com.arkana.browser.themed', 'okno bez przypięcia: własny identyfikator (ikona okna działa na żywo)'); eq(a.appDetails.appIconPath, '', 'bez zapisanej ikony „relaunch”');
  c3.pinnedAumid = () => 'com.arkana.browser'; const b = mkWin(6); c3.applyTaskbar(b); eq(b.appDetails.appId, 'com.arkana.browser', 'przypięty skrót: ten sam identyfikator, więc bez drugiego przycisku'); c3.applyTaskbar(inc); eq(inc.appDetails.appId, 'com.arkana.browser.incognito', 'incognito: osobna grupa');
  // okno wysyła oryginał tylko przy wyłączonej opcji
  const lg = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', '22-logo.js'), 'utf8'); ok(/const on=S\.settings\.ui\.dynicon!==false; window\.api\.setIcon\(on\|\|INC\?drawIcon\(\):'',on\)/.test(lg), 'okno: przy wyłączonej opcji nie wysyła narysowanej ikony');
};
