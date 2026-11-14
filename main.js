const { app, BrowserWindow, nativeTheme, nativeImage, ipcMain, dialog, screen, net, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const ffm = require('./ffmpeg');
const imp = require('./importer');
const perms = require('./permissions'), adblock = require('./adblock'), vaultMod = require('./vault');
nativeTheme.themeSource = 'dark';
// Identyfikator przeglądarki jak w zwykłym Chromium: bez "Electron" i nazwy aplikacji. Ustawiony globalnie (a nie atrybutem useragent
// na każdej karcie), bo nadpisanie UA na karcie wyłącza nagłówki Client Hints i navigator.userAgentData, a strona podająca się
// za Chrome bez nich bywa odrzucana (np. przy logowaniu do konta Google: "ta przeglądarka lub aplikacja może nie być bezpieczna").
{ const major = String(process.versions.chrome || '130').split('.')[0], plat = process.platform === 'win32' ? 'Windows NT 10.0; Win64; x64' : process.platform === 'darwin' ? 'Macintosh; Intel Mac OS X 10_15_7' : 'X11; Linux x86_64';
  app.userAgentFallback = 'Mozilla/5.0 (' + plat + ') AppleWebKit/537.36 (KHTML, like Gecko) Chrome/' + major + '.0.0.0 Safari/537.36'; }
// mniej pracy w tle: wyłączone usługi, których przeglądarka nie używa (Cast, podpowiedzi optymalizacji, tłumaczenie Chromium)
app.commandLine.appendSwitch('disable-features', 'MediaRouter,OptimizationHints,Translate');
app.commandLine.appendSwitch('disable-background-networking');
app.setAppUserModelId('com.arkana.browser');   // własna grupa i ikona na pasku zadań Windows
const ICON = path.join(__dirname, 'icon.ico');
const inits = new Map();                       // id webContents -> stan okna oderwanego (jednorazowego)
const winOf = e => BrowserWindow.fromWebContents(e.sender);
// każda uruchomiona instancja ma własny profil; kolejne instancje startują z kopią stanu pierwszej (ustawienia, notatki…)
// stały folder danych: ten sam przy uruchomieniu z npm/.bat i po instalacji (ustawienia, historia i notatki zostają przy przejściu na instalator)
// stały folder danych. Przy zmianie nazwy z Claude Browser na Arkana Browser dotychczasowe dane (ustawienia, historia, notatki, logowanie w panelu) przenosimy ze starego folderu
{ const base = app.getPath('appData'), OLD = path.join(base, 'claude-browser'), NEW = path.join(base, 'arkana-browser');
  try { if (fs.existsSync(OLD) && !fs.existsSync(NEW)) { try { fs.renameSync(OLD, NEW); } catch { fs.cpSync(OLD, NEW, { recursive: true }); } } } catch (e) { console.error('migracja danych', e); }
  app.setPath('userData', NEW); }
const inst = require('./instance');
const baseData = app.getPath('userData'), slot = inst.claimSlot(baseData);
if (slot.n > 0) {
  try { fs.mkdirSync(slot.dir, { recursive: true }); } catch {}
  try { fs.copyFileSync(path.join(baseData, 'state.json'), path.join(slot.dir, 'state.json')); } catch {}
  app.setPath('userData', slot.dir); app.setPath('sessionData', slot.dir);
}
app.on('quit', () => inst.release(slot)); process.on('exit', () => inst.release(slot));
const stateFile = () => path.join(app.getPath('userData'), 'state.json');

ipcMain.on('get-init', e => { e.returnValue = inits.get(e.sender.id) || { secondary: false }; });
ipcMain.on('load-state', e => {
  if (inits.has(e.sender.id)) { e.returnValue = null; return; }
  try { e.returnValue = JSON.parse(fs.readFileSync(stateFile(), 'utf8')); } catch { e.returnValue = null; }
});
ipcMain.on('save-state', (e, s) => { if (inits.has(e.sender.id)) return; try { fs.writeFileSync(stateFile(), JSON.stringify(s)); } catch {} });
ipcMain.on('win-ctl', (e, a) => {
  const w = winOf(e); if (!w) return;
  if (a === 'min') w.minimize(); else if (a === 'max') (w.isMaximized() ? w.unmaximize() : w.maximize()); else if (a === 'close') w.close();
});
ipcMain.handle('win-state', e => { const w = winOf(e); return !!w && w.isMaximized(); });
ipcMain.on('set-icon', (e, url) => { try { const w = winOf(e); if (w) w.setIcon(nativeImage.createFromDataURL(url)); } catch {} });
// pobieranie kursów walut (tylko wskazane hosty, przez proces główny – bez problemów z CORS)
const HTTP_HOSTS = ['open.er-api.com', 'api.frankfurter.dev', 'translate.googleapis.com', 'api.mymemory.translated.net'];
ipcMain.handle('changelog-get', () => {   // CHANGELOG.txt z folderu aplikacji, czytany przy każdym otwarciu panelu
  try { return { ok: true, text: fs.readFileSync(path.join(__dirname, 'CHANGELOG.txt'), 'utf8').replace(/^\uFEFF/, '') }; }
  catch (e) { return { ok: false, err: String(e.message || e) }; }
});
ipcMain.handle('import-detect', () => { try { return imp.detect(); } catch (e) { return []; } });   // import z innych przeglądarek (importer.js)
ipcMain.handle('import-run', (e, id, what) => imp.run(String(id), what || {}, { session: require('electron').session }).catch(err => ({ ok: false, err: String((err && err.message) || err) })));
ipcMain.handle('import-folder', async e => {
  const r = await dialog.showOpenDialog(winOf(e), { properties: ['openDirectory'] });
  if (r.canceled || !r.filePaths[0]) return { ok: false, canceled: true };
  try { return { ok: true, list: imp.fromFolder(r.filePaths[0]) }; } catch (err) { return { ok: false, err: String((err && err.message) || err) }; }
});
ipcMain.handle('import-html', async e => {
  const r = await dialog.showOpenDialog(winOf(e), { properties: ['openFile'], filters: [{ name: 'Zakładki (HTML)', extensions: ['html', 'htm'] }] });
  if (r.canceled || !r.filePaths[0]) return { ok: false, canceled: true };
  return imp.fromHtml(r.filePaths[0]);
});
ipcMain.handle('http-get', async (_e, url) => {
  try {
    const u = new URL(String(url));
    if (u.protocol !== 'https:' || !HTTP_HOSTS.includes(u.hostname)) return { ok: false, err: 'host' };
    const r = await net.fetch(u.href, { signal: AbortSignal.timeout(12000) });
    if (!r.ok) return { ok: false, err: 'http ' + r.status };
    return { ok: true, body: await r.text() };
  } catch (err) { return { ok: false, err: String((err && err.message) || err) }; }
});
// ----- Zmieniacz formatów: opcjonalny ffmpeg, zapis wyniku, HTML -> PDF -----
ipcMain.handle('ff-probe', () => ffm.probe());
ipcMain.handle('ff-run', (e, job) => { job = job || {}; const w = winOf(e); return ffm.run(job, p => { if (w && !w.isDestroyed()) w.webContents.send('ff-progress', { id: job.id, p }); }); });
ipcMain.handle('save-out', async (e, m) => {
  try {
    const name = String((m && m.name) || 'plik'), ext = path.extname(name).slice(1);
    const r = await dialog.showSaveDialog(winOf(e), { defaultPath: name, filters: ext ? [{ name: ext.toUpperCase(), extensions: [ext] }, { name: '*', extensions: ['*'] }] : [] });
    if (r.canceled || !r.filePath) return null;
    if (m.tmp) { const t = path.resolve(String(m.tmp)); if (!t.startsWith(ffm.OUT + path.sep)) return null; fs.copyFileSync(t, r.filePath); }
    else fs.writeFileSync(r.filePath, Buffer.from(m.data));
    return r.filePath;
  } catch (err) { return null; }
});
ipcMain.handle('html-to-pdf', async (_e, html) => {
  const win = new BrowserWindow({ show: false, webPreferences: { sandbox: true, javascript: false, contextIsolation: true } });
  try { await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(String(html))); return await win.webContents.printToPDF({ printBackground: true, pageSize: 'A4' }); }
  finally { win.destroy(); }
});
// alarm: przywróć okno z paska zadań i wyciągnij na wierzch (wołane z aplikacji Zegar)
ipcMain.on('attention', e => { const w = winOf(e); if (!w) return; if (w.isMinimized()) w.restore(); w.show(); w.focus(); w.flashFrame(true); w.once('focus', () => w.flashFrame(false)); });
ipcMain.on('detach', (e, p) => {                // oderwana karta / folder -> nowe okno
  const src = winOf(e); if (!src || !p || !p.state) return;
  const b = src.isMaximized() ? src.getNormalBounds() : src.getBounds();
  const wa = screen.getDisplayNearestPoint({ x: Math.round(p.x) + 100, y: Math.round(p.y) + 40 }).workArea;
  const x = Math.min(Math.max(Math.round(p.x), wa.x), wa.x + wa.width - 200), y = Math.min(Math.max(Math.round(p.y), wa.y), wa.y + wa.height - 120);
  createWindow({ state: p.state, x, y, w: b.width, h: b.height });
});

// ---- przenoszenie karty między oknami: okno pod kursorem wybieramy wg kolejności ostatniej aktywności ----
const mru = [];                                  // okna od ostatnio aktywnego
let xdTarget = null;
const XD_ZONE = 112;                            // domyślna wysokość strefy upuszczania (pasek tytułu + pasek kart)
function hitWindow(src, sx, sy, zone) {
  const zh = zone > 0 && zone < 400 ? zone : XD_ZONE;   // renderer podaje rzeczywistą wysokość pasków
  for (const w of mru) {
    if (w === src || w.isDestroyed() || w.isMinimized() || !w.isVisible()) continue;
    const b = w.getContentBounds();
    if (sx >= b.x && sx <= b.x + b.width && sy >= b.y && sy <= b.y + zh) return { w, cx: sx - b.x };   // pasek tytułu + pasek kart
  }
  return null;
}
const xdEnd = () => { if (xdTarget && !xdTarget.isDestroyed()) xdTarget.webContents.send('xd', { kind: 'end' }); xdTarget = null; };
ipcMain.handle('xd-move', (e, p) => {
  const src = winOf(e), prev = xdTarget, h = hitWindow(src, p.sx, p.sy, p.zone);
  if (prev && (!h || h.w !== prev)) { xdEnd(); if (!h && src && !src.isDestroyed()) src.moveTop(); }   // kursor wrócił do okna źródłowego
  if (!h) return false;
  if (prev !== h.w) h.w.moveTop();   // okno docelowe wysuwa się na wierzch, żeby było widać całą jego zawartość
  xdTarget = h.w; h.w.webContents.send('xd', { kind: 'over', cx: h.cx, tab: p.tab }); return true;
});
ipcMain.on('xd-end', e => { const had = xdTarget; xdEnd(); const s = winOf(e); if (had && s && !s.isDestroyed()) s.moveTop(); });
ipcMain.handle('xd-drop', (e, p) => {
  const src = winOf(e), h = hitWindow(src, p.sx, p.sy, p.zone), had = xdTarget;
  if (xdTarget && (!h || h.w !== xdTarget)) xdEnd();
  xdTarget = null;
  if (!h && had && src && !src.isDestroyed()) src.moveTop();
  if (!h || !p.tab) return false;
  h.w.webContents.send('xd', { kind: 'drop', cx: h.cx, tab: p.tab }); h.w.focus(); return true;
});

const filters = [{ name: 'Konfiguracja Arkana Browser', extensions: ['json'] }];
ipcMain.handle('export-config', async (e, json, title) => {
  const r = await dialog.showSaveDialog(winOf(e), { title: title || 'Zapisz konfigurację', defaultPath: 'arkana-browser-config.json', filters });
  if (r.canceled || !r.filePath) return null;
  fs.writeFileSync(r.filePath, json); return r.filePath;
});
ipcMain.handle('import-config', async (e, title) => {
  const r = await dialog.showOpenDialog(winOf(e), { title: title || 'Wczytaj konfigurację', properties: ['openFile'], filters });
  if (r.canceled || !r.filePaths[0]) return null;
  return fs.readFileSync(r.filePaths[0], 'utf8');
});

// ---- skróty klawiszowe (przypisania przysyła okno ustawień; do 4 klawiszy naraz) ----
let bindings = { devtools: 'F12' };
const downs = new WeakMap();                    // naciśnięte klawisze osobno dla każdego okna
const downOf = w => { let d = downs.get(w); if (!d) { d = new Map(); downs.set(w, d); } return d; };
const pausedW = new WeakSet();                  // okna, w których trwa nagrywanie skrótu
ipcMain.on('set-keys', (e, k) => { if (inits.has(e.sender.id)) return; bindings = k || {}; });   // skróty ustawia tylko okno główne (okno oderwane ma kopię i mogłoby je nadpisać starą)
ipcMain.on('pause-keys', (e, v) => { const w = winOf(e); if (!w) return; if (v) pausedW.add(w); else pausedW.delete(w); downOf(w).clear(); });
const NAMES = { Comma: ',', Period: '.', Slash: '/', Semicolon: ';', Quote: "'", BracketLeft: '[', BracketRight: ']', Backslash: '\\', Minus: '-', Equal: '=', Backquote: '`', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' };
const keyLabel = c => /^Key[A-Z]$/.test(c) ? c[3] : /^Digit\d$/.test(c) ? c[5] : NAMES[c] || c;
const isMod = c => /^(Control|Shift|Alt|Meta)(Left|Right)$/.test(c);

function onKey(e, i, win) {
  if (pausedW.has(win) || !i.code) return;
  const down = downOf(win);
  if (i.type === 'keyUp') { if (!isMod(i.code)) down.delete(keyLabel(i.code)); return; }
  if (i.type !== 'keyDown' || isMod(i.code)) return;
  const now = Date.now();
  for (const [k, t] of down) if (now - t > 4000) down.delete(k);
  down.set(keyLabel(i.code), now);
  const cur = new Set([...(i.control ? ['Ctrl'] : []), ...(i.alt ? ['Alt'] : []), ...(i.shift ? ['Shift'] : []), ...down.keys()]);
  for (const [a, str] of Object.entries(bindings)) {
    if (!str) continue;
    const p = str.split('+');
    if (p.length === cur.size && p.every(x => cur.has(x))) {
      e.preventDefault();
      if (i.isAutoRepeat) return;
      if (a === 'ui-devtools') win.webContents.toggleDevTools(); else win.webContents.send('shortcut', a);
      return;
    }
  }
}

// Przypięty skrót na pasku zadań ma zachować ikonę Arkany (bez tego Windows bierze ikonę z electron.exe, gdy aplikacja działa z kodu źródłowego).
// Po tej zmianie przypięty wcześniej skrót trzeba odpiąć i przypiąć ponownie.
function applyTaskbar(win) {
  if (process.platform !== 'win32') return;
  try {
    const exe = process.execPath, rel = app.isPackaged ? '"' + exe + '"' : '"' + exe + '" "' + app.getAppPath() + '"';
    win.setAppDetails({ appId: 'com.arkana.browser', appIconPath: app.isPackaged ? exe : ICON, appIconIndex: 0, relaunchCommand: rel, relaunchDisplayName: 'Arkana Browser' });
  } catch (e) { console.error('setAppDetails', e); }
}
const GUEST_PRELOAD = path.join(__dirname, 'wv-preload.js');
function createWindow(o = {}) {
  const win = new BrowserWindow({
    width: o.w || 1360, height: o.h || 880, x: o.x, y: o.y, title: 'Arkana Browser', backgroundColor: '#16120f',
    frame: false, // własne przyciski okna rysuje index.html
    ...(fs.existsSync(ICON) ? { icon: ICON } : {}),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), webviewTag: true, contextIsolation: true }
  });
  applyTaskbar(win);
  const id = win.webContents.id;
  if (o.state) inits.set(id, { secondary: true, state: o.state });
  win.setMenu(null);
  win.on('maximize', () => win.webContents.send('win-state', true));
  win.on('unmaximize', () => win.webContents.send('win-state', false));
  win.on('blur', () => downOf(win).clear());
  const handle = (e, i) => onKey(e, i, win);
  win.webContents.on('before-input-event', handle);
  win.webContents.on('will-attach-webview', (_e, wp, params) => {   // karty dostają tylko nasz skrypt wp-preload; panel asystenta (partycja claude) żadnego
    delete wp.preloadURL; wp.nodeIntegration = false; wp.nodeIntegrationInSubFrames = false; wp.contextIsolation = true;
    if (params.partition === 'persist:claude') delete wp.preload; else wp.preload = GUEST_PRELOAD;
  });
  win.webContents.on('did-attach-webview', (_e, wc) => {
    wc.on('before-input-event', handle); // skróty działają też, gdy fokus jest na stronie
    wc.setWindowOpenHandler(({ url }) => { win.webContents.send('open-tab', url); return { action: 'deny' }; });
  });
  mru.unshift(win);
  win.on('focus', () => { const i = mru.indexOf(win); if (i > 0) { mru.splice(i, 1); mru.unshift(win); } });
  win.on('closed', () => { inits.delete(id); const i = mru.indexOf(win); if (i >= 0) mru.splice(i, 1); });
  win.loadFile('index.html');
  return win;
}

app.whenReady().then(() => {
  // zabezpieczenie: gdyby Client Hints zawierały markę "Electron", usuwamy ją z nagłówków (domyślna sesja i panel asystenta)
  try {
    const { session } = require('electron'), scrub = d => { const h = d.requestHeaders; for (const k of Object.keys(h)) if (/^sec-ch-ua(-full-version-list)?$/i.test(k) && /electron/i.test(h[k])) h[k] = h[k].replace(/"Electron";v="[^"]*",?\s*/gi, '').replace(/,\s*$/, ''); return { requestHeaders: h }; };
    for (const ses of [session.defaultSession, session.fromPartition('persist:claude')]) ses.webRequest.onBeforeSendHeaders((d, cb) => cb(scrub(d)));
  } catch (e) { console.error('client-hints', e); }
  try {
    const { session, safeStorage } = require('electron'), dir = app.getPath('userData');
    const store = new perms.Store(path.join(dir, 'permissions.json')), ask = perms.broker(ipcMain, store);
    for (const ses of [session.defaultSession, session.fromPartition('persist:claude')]) perms.install(ses, store, ask);
    adblock.install(session.defaultSession);   // panel asystenta zostaje bez filtrowania
    ipcMain.on('adblock-set', (_e, on) => { adblock.state.on = !!on; });
    ipcMain.handle('adblock-stats', () => ({ on: adblock.state.on, count: adblock.state.count }));
    vaultMod.register(ipcMain, new vaultMod.Vault(path.join(dir, 'vault.bin'), vaultMod.safeCipher(safeStorage)));
  } catch (e) { console.error('prywatność', e); }
  // automatyczne aktualizacje: tylko pierwsza instancja (kolejne nie mogą jednocześnie pobierać do tego samego folderu)
  try { require('./updater').init({ app, ipcMain, BrowserWindow, shell, net, isSecondary: id => inits.has(id), primary: slot.n === 0 }); } catch (e) { console.error('updater', e); }
  createWindow();
});
app.on('window-all-closed', () => app.quit());
