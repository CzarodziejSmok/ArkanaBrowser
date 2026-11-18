const { app, BrowserWindow, nativeTheme, nativeImage, ipcMain, dialog, screen, net, shell, webContents } = require('electron');
const path = require('path');
const fs = require('fs');
const ffm = require('./ffmpeg');
const imp = require('./importer');
const perms = require('./permissions'), adblock = require('./adblock'), vaultMod = require('./vault'), wl = require('./weblogin'), tbar = require('./taskbar'), adpage = require('./adblock-page'), db = require('./defaultbrowser'), pagecolor = require('./pagecolor'), fontsMod = require('./fonts');
const { execFile } = require('child_process');
const dls = require('./downloads');   // pobrane pliki, kolejka i postęp (ikona w pasku adresu)
// Uruchomienie z kodu zrodlowego (npm start, plik .bat, electron .): js/bundle.js jest plikiem GENEROWANYM (lezy w .gitignore, nie ma go w repozytorium),
// wiec przy kazdym starcie skladamy go od nowa z src/js. Bez tego okno ladowaloby stary bundle.js z poprzedniej wersji, a proces glowny (main.js) byłby nowy -
// funkcje wymagajace obu stron (np. okno incognito) przestawalyby dzialac. W instalatorze (app.isPackaged) bundle jest zlozony przy budowaniu i ten kod sie nie wykonuje.
if (!app.isPackaged) { try { const r = require('./tools/bundle.js').build(); console.log('js/bundle.js zlozony ze zrodel: ' + r.files.length + ' plikow'); } catch (e) { console.error('skladanie js/bundle.js', e); } }
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
// Arkana jako przeglądarka domyślna: kliknięty w innym programie link (lub plik .html) startuje Arkanę z adresem w linii poleceń.
// Normalne uruchomienie bez adresu nadal tworzy nową instancję z własnym profilem. Uruchomienie Z adresem, gdy Arkana już działa, przekazuje
// adres działającej instancji (zdarzenie second-instance) i kończy się, zamiast otwierać kolejne okno z osobnym profilem.
const startUrl = db.urlFromArgv(process.argv);
if (!app.requestSingleInstanceLock({ url: startUrl }) && startUrl) { app.exit(0); process.exit(0); }
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
// Zapis stanu nie blokuje procesu głównego (który obsługuje też klawisze, mysz i sieć wszystkich okien): okno przysyła gotowy tekst JSON, zapis idzie
// asynchronicznie do pliku tymczasowego i podmienia state.json (rename), a kolejne zapisy w trakcie trwającego łączą się w jeden (zostaje najnowszy).
// Przy zamykaniu programu ostatni stan jest dopisywany synchronicznie, więc nic nie ginie.
let stPending = null, stBusy = false, stQuit = false;
function stFlush() {
  if (stBusy || stPending === null || stQuit) return;
  const data = stPending, f = stateFile(), tmp = f + '.tmp'; stPending = null; stBusy = true;
  const done = () => { stBusy = false; if (stQuit) app.quit(); else stFlush(); };   // zamykanie czekało na koniec zapisu: teraz kończymy (resztę dopisze stFlushSync)
  fs.writeFile(tmp, data, err => {
    if (err) { try { fs.writeFileSync(f, data); } catch {} return done(); }
    fs.rename(tmp, f, e2 => { if (e2) { try { fs.writeFileSync(f, data); } catch {} } done(); });
  });
}
function stFlushSync() { if (stPending === null || stBusy) return; const data = stPending; stPending = null; try { fs.writeFileSync(stateFile(), data); } catch {} }
ipcMain.on('save-state', (e, s) => {
  if (inits.has(e.sender.id)) return;
  try { stPending = typeof s === 'string' ? s : JSON.stringify(s); } catch { return; }
  stFlush();
});
// zamykanie programu: jeśli zapis właśnie trwa, czekamy na jego koniec (inaczej starszy zapis mógłby nadpisać nowszy), potem ostatni stan synchronicznie
app.on('will-quit', e => { if (stBusy) { e.preventDefault(); stQuit = true; return; } stFlushSync(); });
process.on('exit', stFlushSync);
ipcMain.on('win-ctl', (e, a) => {
  const w = winOf(e); if (!w) return;
  if (a === 'min') w.minimize(); else if (a === 'max') (w.isMaximized() ? w.unmaximize() : w.maximize()); else if (a === 'close') w.close();
});
ipcMain.handle('win-state', e => { const w = winOf(e); return !!w && w.isMaximized(); });
// ---- ikona na pasku zadań w kolorach motywu (tło = kolor główny, symbol = akcent): rysuje ją okno (drawIcon), szczegóły przy applyTaskbar ----
const icoTimers = new WeakMap();
ipcMain.on('set-icon', (e, url, on) => {
  const w = winOf(e); if (!w) return;
  // opcja wyłączona: oryginalna ikona programu (wygląd bez zmian, kolor bazowy); włączona: ikona w kolorach motywu narysowana przez okno
  let img; try { img = on === false && !incWins.has(w) ? baseIcon() : nativeImage.createFromDataURL(String(url)); if (!img || img.isEmpty()) return; w.setIcon(img); } catch { return; }
  if (process.platform !== 'win32' || incWins.has(w)) return;   // okno incognito ma własną (szarą) ikonę okna, ale nie zmienia ikony grupy
  clearTimeout(icoTimers.get(w));
  icoTimers.set(w, setTimeout(() => { try {
    if (w.isDestroyed()) return;
    const want = on !== false;
    for (const x of BrowserWindow.getAllWindows()) if (!incWins.has(x) && !x.isDestroyed()) { try { x.setIcon(img); } catch {} }   // wszystkie zwykłe okna naraz (zmiana działa od razu w obie strony)
    // Przypięty skrót na pasku zadań ma ustaloną ikonę i Windows rysuje ją zamiast ikony okna – dlatego zmieniamy ikonę w samym skrócie (taskbar.js).
    // Zmieniamy tylko ikonę istniejącego pliku .lnk (tryb „update”), nie usuwamy go i nie tworzymy od nowa; menu Start i pulpit zostają bez zmian.
    const po = { shell, appData: app.getPath('appData'), exe: process.execPath, appPath: app.getAppPath(), packaged: app.isPackaged, fallback: ICON, notify: f => tbar.notifyShell(f, execFile) };
    if (want) { const r = tbar.applyThemeIcon({ ...po, img, dir: path.join(baseData, 'icons') }); if (r.updated) console.log('ikona przypiętego skrótu zaktualizowana:', r.updated); }
    else tbar.restoreIcon(po);
  } catch (err) { console.error('ikona paska zadań', err); } }, 900));
});
// ---- logowanie Google / klucze dostępu (weblogin.js) ----
ipcMain.on('web-cfg', e => { e.returnValue = { ...wl.pageCfg(), ...adpage.pageCfg(adblock.state.on) }; });   // uzupełnienie API Chrome i blokada kluczy dostępu dla skryptu karty
ipcMain.on('web-cfg-set', (_e, c) => { wl.setCfg(c); });
// ---- nowe okno / okno incognito ----
ipcMain.on('new-win', (e, p) => {
  const src = winOf(e); p = p || {};
  const b = src ? (src.isMaximized() ? src.getNormalBounds() : src.getBounds()) : null;
  createWindow({ state: p.state || null, inc: !!p.inc, x: b ? b.x + 32 : undefined, y: b ? b.y + 32 : undefined, w: b ? b.width : undefined, h: b ? b.height : undefined });
});
// pobieranie kursów walut (tylko wskazane hosty, przez proces główny – bez problemów z CORS)
const HTTP_HOSTS = ['open.er-api.com', 'api.frankfurter.dev', 'translate.googleapis.com', 'api.mymemory.translated.net'];
ipcMain.handle('screen-capture', async e => { try { const img = await e.sender.capturePage(), z = img.getSize(); return { url: img.toDataURL(), w: z.width, h: z.height }; } catch { return null; } });   // pipeta: zrzut okna
ipcMain.handle('screen-capture-wc', async (e, id) => { try { const wc = webContents.fromId(Number(id)); if (!wc || wc.hostWebContents !== e.sender) return null; const img = await wc.capturePage(), z = img.getSize(); return { url: img.toDataURL(), w: z.width, h: z.height }; } catch { return null; } });   // pipeta: zrzut strony w karcie
ipcMain.handle('dl-list', e => dls.visible(e.sender.id));   // lista pobranych (zwykłe okna: wspólna; incognito: tylko własne)
ipcMain.on('dl-show', (_e, id) => dls.show(String(id)));
ipcMain.on('dl-open', (_e, id) => dls.open(String(id)));
ipcMain.on('dl-cancel', (_e, id) => dls.cancel(String(id)));
ipcMain.on('dl-remove', (_e, id) => dls.remove(String(id)));
ipcMain.handle('dl-clear', e => dls.clear(e.sender.id));
ipcMain.handle('dl-icon', (_e, id) => dls.icon(String(id)));
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
  createWindow({ state: p.state, inc: incWins.has(src), x, y, w: b.width, h: b.height });   // karta oderwana od okna incognito zostaje w incognito
});

// ---- przenoszenie karty między oknami: okno pod kursorem wybieramy wg kolejności ostatniej aktywności ----
const mru = [];                                  // okna od ostatnio aktywnego
let xdTarget = null;
const XD_ZONE = 112;                            // domyślna wysokość strefy upuszczania (pasek tytułu + pasek kart)
function hitWindow(src, sx, sy, zone) {
  const zh = zone > 0 && zone < 400 ? zone : XD_ZONE;   // renderer podaje rzeczywistą wysokość pasków
  for (const w of mru) {
    if (w === src || w.isDestroyed() || w.isMinimized() || !w.isVisible()) continue;
    if (incWins.has(w) !== incWins.has(src)) continue;   // karty nie przechodzą między zwykłym oknem a incognito (inne ciasteczka i sesja)
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

const runAction = (win, a) => { if (a === 'ui-devtools') win.webContents.toggleDevTools(); else win.webContents.send('shortcut', a); };

// ---- przyciski myszy w skrótach: środkowy i boczne (dowolna liczba); lewy i prawy są zablokowane ----
// Zapis: [Ctrl+][Alt+][Shift+]MouseN, gdzie N = 3 (środkowy), 4 (boczny „wstecz”), 5 (boczny „dalej”), 6… (kolejne przyciski myszy).
// Modyfikatory są opcjonalne: przypisanie samego „Mouse4” działa bez żadnego klawisza, a „Ctrl+Mouse4” tylko z wciśniętym Ctrl.
const MOUSE_RE = /^(?:(Ctrl)\+)?(?:(Alt)\+)?(?:(Shift)\+)?Mouse(\d{1,2})$/;
function findMouseBinding(m) {
  const n = m && Number.isInteger(m.n) ? m.n : 0; if (n < 3 || n > 64) return null;
  for (const [a, str] of Object.entries(bindings)) {
    const x = MOUSE_RE.exec(str || '');
    if (x && +x[4] === n && !!x[1] === !!m.ctrl && !!x[2] === !!m.alt && !!x[3] === !!m.shift) return a;
  }
  return null;
}
const lastMouse = new Map();   // okno:przycisk -> kiedy i skąd (mysz / polecenie systemu) ostatnio uruchomiliśmy skrót
// ten sam fizyczny klik boczny może dojść dwiema drogami (zdarzenie myszy i polecenie aplikacji Windows) – drugiej nie wykonujemy
function mouseFire(win, n, src, a) {
  const k = win.id + ':' + n, now = Date.now(), l = lastMouse.get(k); lastMouse.set(k, { t: now, src });
  if (l && l.src !== src && now - l.t < 400) return;
  runAction(win, a);
}
// strona (karta lub okno programu) pyta synchronicznie, czy kliknięty przycisk jest przypisany; jeśli tak, skrót jest wykonywany od razu
ipcMain.on('mouse-key', (e, m) => {
  e.returnValue = false;
  try {
    const win = BrowserWindow.fromWebContents(e.sender.hostWebContents || e.sender);
    if (!win || pausedW.has(win)) return;                  // trwa nagrywanie skrótu: klik obsługuje okno ustawień
    const a = findMouseBinding(m); if (!a) return;
    e.returnValue = true; mouseFire(win, m.n, 'mouse', a);
  } catch {}
});

let kpSrc = null, kpList = [];
const keyParts = () => { if (kpSrc !== bindings) { kpSrc = bindings; kpList = Object.entries(bindings || {}).filter(([, s]) => s).map(([a, s]) => [a, String(s).split('+')]); } return kpList; };
function onKey(e, i, win) {
  if (pausedW.has(win) || !i.code) return;
  const down = downOf(win);
  if (i.type === 'keyUp') { if (!isMod(i.code)) down.delete(keyLabel(i.code)); return; }
  if (i.type !== 'keyDown' || isMod(i.code)) return;
  const now = Date.now();
  for (const [k, t] of down) if (now - t > 4000) down.delete(k);
  down.set(keyLabel(i.code), now);
  const cur = new Set([...(i.control ? ['Ctrl'] : []), ...(i.alt ? ['Alt'] : []), ...(i.shift ? ['Shift'] : []), ...down.keys()]);
  for (const [a, p] of keyParts()) {
    if (p.length === cur.size && p.every(x => cur.has(x))) {
      e.preventDefault();
      if (i.isAutoRepeat) return;
      runAction(win, a);
      return;
    }
  }
}

// Przypięty skrót na pasku zadań ma zachować ikonę Arkany (bez tego Windows bierze ikonę z electron.exe, gdy aplikacja działa z kodu źródłowego).
// Po tej zmianie przypięty wcześniej skrót trzeba odpiąć i przypiąć ponownie.
// Ikona na pasku zadań (sprawdzone na Windows 11, 14.11.2026):
// - okno z tym samym identyfikatorem co skróty instalatora (com.arkana.browser) dostaje ikonę ze skrótu – stałą, niezależną od okna;
// - okno z własnym identyfikatorem i bez zapisanej ikony „relaunch” pokazuje ikonę okna (win.setIcon), która zmienia się na żywo.
// Identyfikator okna jest ustalany przy jego tworzeniu i Windows ignoruje jego zmianę w trakcie działania, dlatego okna ZAWSZE dostają ten sam
// własny identyfikator (THEMED_ID – albo identyfikator przypiętego skrótu, żeby nie powstał drugi przycisk), niezależnie od opcji
// „Ikona aplikacji w kolorach motywu”. Wygląd ikony zależy wtedy tylko od tego, co wyślemy w set-icon: przy włączonej opcji ikona w kolorach motywu,
// przy wyłączonej – oryginalna ikona programu (icon.ico). Dzięki temu przełączanie działa od razu w obie strony, bez restartu.
// Proces zostaje przy com.arkana.browser (powiadomienia systemowe).
const THEMED_ID = 'com.arkana.browser.themed';
try { fs.unlinkSync(path.join(baseData, 'icons', 'static-icon')); } catch {}   // plik z poprzednich wersji (blokował powrót do ikony w kolorach motywu)
// oryginalna ikona programu (ten sam wygląd co plik .exe i skrót); null, gdy nie da się jej wczytać
function baseIcon() {
  for (const f of [ICON, path.join(__dirname, 'icon.png')]) { try { const i = nativeImage.createFromPath(f); if (i && !i.isEmpty()) return i; } catch {} }
  try { const i = nativeImage.createFromBuffer(fs.readFileSync(path.join(__dirname, 'icon.png'))); if (!i.isEmpty()) return i; } catch {}
  return null;
}
function pinnedAumid() {
  try { const p = tbar.findPinned({ shell, appData: app.getPath('appData'), exe: process.execPath, appPath: app.getAppPath(), packaged: app.isPackaged }).find(x => x.aumid); return p ? p.aumid : ''; } catch { return ''; }
}
function applyTaskbar(win) {
  if (process.platform !== 'win32') return;
  try {
    const clear = { appIconPath: '', relaunchCommand: '', relaunchDisplayName: '' };   // puste = bez ikony „relaunch”, Windows pokazuje ikonę okna
    if (incWins.has(win)) { win.setAppDetails({ appId: 'com.arkana.browser.incognito', ...clear }); return; }   // incognito: osobny przycisk z szarą ikoną
    // przypięty skrót Arkany: okno musi mieć jego identyfikator, żeby trafić na ten sam przycisk (inaczej obok przypiętego pojawia się drugi);
    // ikonę przycisku zmieniamy wtedy w samym skrócie (taskbar.js). Bez przypięcia – własny identyfikator i ikona okna na żywo.
    win.setAppDetails({ appId: pinnedAumid() || THEMED_ID, ...clear });   // puste = usuń ikonę „relaunch”; ikonę okna ustawia set-icon
  } catch (e) { console.error('setAppDetails', e); }
}
// ---- sesje: nagłówki (logowanie Google, Client Hints), uprawnienia i blokowanie reklam ----
const sesReady = new WeakSet();
let permStore = null, permAsk = null;
function prepSession(ses, opts = {}) {
  if (!ses || sesReady.has(ses)) return; sesReady.add(ses);
  try { ses.webRequest.onBeforeSendHeaders((d, cb) => { try { cb({ requestHeaders: wl.rewriteHeaders(d.url, d.requestHeaders) }); } catch { cb({}); } }); } catch (e) { console.error('nagłówki', e); }
  try { if (permStore) perms.install(ses, permStore, permAsk); } catch (e) { console.error('uprawnienia', e); }
  if (opts.adblock) try { adblock.install(ses); } catch (e) { console.error('reklamy', e); }
}
// incognito: wspólna sesja w pamięci dla wszystkich otwartych okien incognito; po zamknięciu ostatniego dane znikają
const incWins = new Set();
let incPart = null;
function incPartition() { if (!incPart) incPart = 'arkana-incognito-' + Date.now().toString(36); return incPart; }
function incClosed(win) {
  incWins.delete(win);
  if (incWins.size || !incPart) return;
  const p = incPart; incPart = null;
  try { require('electron').session.fromPartition(p).clearStorageData(); } catch {}
}
const GUEST_PRELOAD = path.join(__dirname, 'wv-preload.js'), SHIM_PRELOAD = path.join(__dirname, 'wv-shim.js');
function createWindow(o = {}) {
  const win = new BrowserWindow({
    width: o.w || 1360, height: o.h || 880, x: o.x, y: o.y, title: 'Arkana Browser', backgroundColor: '#16120f',
    frame: false, // własne przyciski okna rysuje index.html
    ...(fs.existsSync(ICON) ? { icon: ICON } : {}),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), webviewTag: true, contextIsolation: true }
  });
  const id = win.webContents.id;
  if (o.inc) { incWins.add(win); win.on('closed', () => incClosed(win)); }
  applyTaskbar(win);
  if (o.state || o.inc) inits.set(id, { secondary: true, state: o.state || null, inc: !!o.inc, part: o.inc ? incPartition() : '' });
  win.setMenu(null);
  win.on('maximize', () => win.webContents.send('win-state', true));
  win.on('unmaximize', () => win.webContents.send('win-state', false));
  win.on('blur', () => downOf(win).clear());
  // boczne przyciski myszy Windows zgłasza też jako polecenie aplikacji (wstecz/dalej); gdy przypisano Mouse4/Mouse5, zastępujemy nim domyślne działanie
  // (uwaga: to samo polecenie wysyłają klawisze multimedialne „Wstecz/Dalej” w przeglądarce na niektórych klawiaturach)
  win.on('app-command', (e, cmd) => {
    const n = cmd === 'browser-backward' ? 4 : cmd === 'browser-forward' ? 5 : 0; if (!n || pausedW.has(win)) return;
    const a = findMouseBinding({ n, ctrl: false, alt: false, shift: false }); if (!a) return;
    e.preventDefault(); mouseFire(win, n, 'app', a);
  });
  const handle = (e, i) => onKey(e, i, win);
  win.webContents.on('before-input-event', handle);
  win.webContents.on('will-attach-webview', (_e, wp, params) => {   // karty dostają tylko nasz skrypt wp-preload; panel asystenta (partycja claude) żadnego
    delete wp.preloadURL; wp.nodeIntegration = false; wp.nodeIntegrationInSubFrames = false; wp.contextIsolation = true;
    wp.preload = params.partition === 'persist:claude' ? SHIM_PRELOAD : GUEST_PRELOAD;   // panel asystenta: tylko uzupełnienie API (logowanie Google), bez haseł
    // okno incognito: karty tylko w sesji incognito w pamięci (ustala to proces główny, strona okna nie może tego zmienić)
    if (incWins.has(win) && params.partition !== 'persist:claude') { const p = incPartition(); wp.partition = p; params.partition = p; const ises = require('electron').session.fromPartition(p); prepSession(ises, { adblock: true }); dls.install(ises, true); }
  });
  win.webContents.on('did-attach-webview', (_e, wc) => {
    wc.on('before-input-event', handle); // skróty działają też, gdy fokus jest na stronie
    // okienka logowania („Zaloguj przez Google/Facebook…”) muszą zostać okienkami, bo wynik wracają do strony, która je otworzyła;
    // pozostałe linki otwierające nowe okno trafiają do nowej karty
    wc.setWindowOpenHandler(({ url, disposition, features }) => {
      if (disposition === 'new-window' && /^https?:/i.test(url) && (wl.isGoogleAuth(url) || /width|height|popup/i.test(features || ''))) {
        return { action: 'allow', outlivesOpener: false, overrideBrowserWindowOptions: { parent: win, autoHideMenuBar: true, backgroundColor: '#ffffff', ...(fs.existsSync(ICON) ? { icon: ICON } : {}),
          webPreferences: { preload: GUEST_PRELOAD, contextIsolation: true, nodeIntegration: false, sandbox: true } } };
      }
      win.webContents.send('open-tab', url); return { action: 'deny' };
    });
    wc.on('did-create-window', pw => { try { pw.setMenu(null); pw.webContents.on('before-input-event', handle); pw.webContents.setWindowOpenHandler(({ url }) => { win.webContents.send('open-tab', url); return { action: 'deny' }; }); } catch {} });
  });
  mru.unshift(win);
  win.on('focus', () => { const i = mru.indexOf(win); if (i > 0) { mru.splice(i, 1); mru.unshift(win); } });
  win.on('closed', () => { inits.delete(id); const i = mru.indexOf(win); if (i >= 0) mru.splice(i, 1); });
  win.loadFile('index.html');
  return win;
}

app.whenReady().then(() => {
  // nagłówki (logowanie Google, marka "Electron" w Client Hints), zgody stron i blokowanie reklam: domyślna sesja i panel asystenta
  try {
    const { session, safeStorage } = require('electron'), dir = app.getPath('userData');
    permStore = new perms.Store(path.join(dir, 'permissions.json')); permAsk = perms.broker(ipcMain, permStore);
    prepSession(session.defaultSession, { adblock: true });
    dls.load(); dls.install(session.defaultSession, false);
    prepSession(session.fromPartition('persist:claude'));   // panel asystenta zostaje bez filtrowania reklam
    ipcMain.on('adblock-set', (_e, on) => { adblock.state.on = !!on; });
    ipcMain.handle('adblock-stats', () => ({ on: adblock.state.on, count: adblock.state.count }));
    vaultMod.register(ipcMain, new vaultMod.Vault(path.join(dir, 'vault.bin'), vaultMod.safeCipher(safeStorage)));
  } catch (e) { console.error('prywatność', e); }
  // automatyczne aktualizacje: tylko pierwsza instancja (kolejne nie mogą jednocześnie pobierać do tego samego folderu)
  try { require('./updater').init({ app, ipcMain, BrowserWindow, shell, net, isSecondary: id => inits.has(id), primary: slot.n === 0 }); } catch (e) { console.error('updater', e); }
  const first = createWindow();
  if (startUrl) first.webContents.once('did-finish-load', () => setTimeout(() => { try { first.webContents.send('open-tab', startUrl); } catch {} }, 700));
  refreshBrowserRegistration();
});
// adres przekazany przez drugi proces Arkany (kliknięty link w innym programie): do ostatnio używanego zwykłego okna, w nowej karcie
function openUrlInApp(u) {
  if (!/^(https?|file):\/\//i.test(String(u || '')) || String(u).length > 8192) return;
  const w = mru.find(x => !x.isDestroyed() && !incWins.has(x)) || mru.find(x => !x.isDestroyed());
  if (!w) { const n = createWindow(); n.webContents.once('did-finish-load', () => setTimeout(() => { try { n.webContents.send('open-tab', u); } catch {} }, 700)); return; }
  if (w.isMinimized()) w.restore(); w.show(); w.focus(); w.webContents.send('open-tab', u);
}
app.on('second-instance', (_e, argv, _cwd, data) => { openUrlInApp((data && data.url) || db.urlFromArgv(argv)); });

// ---- kolory krawędzi otwartej strony (przejście kolorów interfejsu i strony; pagecolor.js) ----
// Okno prosi o zrzut aktywnej karty (tylko własnej: wc.hostWebContents musi być nadawcą); zrzut zmniejszamy i liczymy dominujące kolory krawędzi.
// Zwykle zrzucamy tylko trzy wąskie pasy przy krawędziach (te same obszary, które liczy edgeColors), co daje ok. 10% pikseli całej strony.
async function stripColors(wc, sz) {
  const w = Math.round(sz && sz.w), h = Math.round(sz && sz.h); if (!(w > 24 && h > 24 && w < 20000 && h < 20000)) return null;
  const sw = Math.max(1, Math.ceil(w * pagecolor.SW)), sh = Math.max(1, Math.ceil(h * pagecolor.SH)), k = Math.min(1, pagecolor.DW / w);
  const rects = [{ x: 0, y: 0, width: w, height: sh }, { x: 0, y: 0, width: sw, height: h }, { x: w - sw, y: 0, width: sw, height: h }];
  const imgs = await Promise.all(rects.map(r => wc.capturePage(r)));
  const strips = [];
  for (const img of imgs) {
    if (!img || img.isEmpty()) return null;
    const s = img.getSize(), small = k < 1 ? img.resize({ width: Math.max(1, Math.round(s.width * k)), height: Math.max(1, Math.round(s.height * k)), quality: 'good' }) : img, z = small.getSize();
    strips.push({ buf: small.toBitmap(), w: z.width, h: z.height });
  }
  return pagecolor.stripColors(strips[0], strips[1], strips[2]);
}
ipcMain.handle('page-colors', async (e, id, sz) => {
  try {
    if (!Number.isInteger(id)) return null;
    const wc = webContents.fromId(id); if (!wc || wc.isDestroyed() || wc.hostWebContents !== e.sender) return null;
    try { const r = await stripColors(wc, sz); if (r && r.c) return r; } catch {}
    const img = await wc.capturePage(); if (!img || img.isEmpty()) return null;
    const s = img.getSize(), small = s.width > 240 ? img.resize({ width: 240, quality: 'good' }) : img, z = small.getSize();
    return pagecolor.edgeColors(small.toBitmap(), z.width, z.height);
  } catch { return null; }
});

// ---- czcionki interfejsu (fonts.js): czcionki systemu (odczyt z plików) i czcionki dodane do przeglądarki ----
// Okno nie podaje ścieżek: wybiera je użytkownik w oknie dialogowym, a dodane czcionki są identyfikowane własnym id (zob. fonts.js).
const fontStore = fontsMod.store(baseData);
let sysFonts = null, sysFontsP = null;
const sysFontList = force => { if (force) { sysFonts = null; sysFontsP = null; } if (sysFonts) return Promise.resolve(sysFonts);
  return sysFontsP || (sysFontsP = fontsMod.listSystem().then(l => { sysFonts = l; sysFontsP = null; return l; }).catch(() => { sysFontsP = null; return []; })); };
ipcMain.handle('fonts-list', async (_e, mode) => mode === 'user' ? { sys: null, user: fontStore.list() } : { sys: await sysFontList(mode === 'refresh'), user: fontStore.list() });   // 'user': tylko dodane czcionki (start), '' – też system (otwarcie sekcji), 'refresh' – ponowny odczyt systemu
ipcMain.handle('fonts-add', async e => {
  const r = await dialog.showOpenDialog(winOf(e), { title: 'Dodaj czcionkę do Arkany', properties: ['openFile', 'multiSelections'], filters: [{ name: 'Czcionki (TTF, OTF, TTC, WOFF, WOFF2)', extensions: ['ttf', 'otf', 'ttc', 'otc', 'woff', 'woff2'] }] });
  if (r.canceled || !r.filePaths.length) return { added: [], skipped: [] };
  return fontStore.add(r.filePaths);
});
ipcMain.handle('fonts-remove', (_e, id) => fontStore.remove(String(id)));
ipcMain.handle('fonts-read', (_e, id) => { const b = fontStore.read(String(id)); return b ? new Uint8Array(b) : null; });

// ---- przeglądarka domyślna (szczegóły w defaultbrowser.js) ----
const dbOpts = () => ({ exe: process.execPath, appPath: app.getAppPath(), packaged: app.isPackaged, icon: ICON, execFile, description: 'Arkana Browser' });
const dbMarker = path.join(baseData, 'defbrowser.json');
const openDefaultApps = async () => {   // Windows 11 otwiera od razu stronę tej aplikacji, starsze wersje ogólną listę domyślnych aplikacji
  for (const u of ['ms-settings:defaultapps?registeredAppUser=' + encodeURIComponent(db.APP_NAME), 'ms-settings:defaultapps']) { try { await shell.openExternal(u); return true; } catch {} }
  return false;
};
ipcMain.handle('default-browser', async (e, op) => {
  if (inits.has(e.sender.id)) return { supported: false };
  if (process.platform !== 'win32') {
    if (op === 'set') { try { app.setAsDefaultProtocolClient('http'); app.setAsDefaultProtocolClient('https'); } catch {} }
    return { supported: true, win: false, registered: true, isDefault: app.isDefaultProtocolClient('http') && app.isDefaultProtocolClient('https') };
  }
  let ok = true;
  if (op === 'set') {
    ok = await db.register(dbOpts());
    if (ok) { try { fs.writeFileSync(dbMarker, JSON.stringify({ ver: app.getVersion(), exe: process.execPath })); } catch {} await openDefaultApps(); }
  } else if (op === 'open') ok = await openDefaultApps();
  else if (op === 'unset') { ok = await db.unregister(dbOpts()); try { fs.unlinkSync(dbMarker); } catch {} }
  return { supported: true, win: true, ok, ...(await db.status(dbOpts())) };
});
// po aktualizacji lub przeniesieniu programu odświeżamy rejestrację (ścieżka do exe mogła się zmienić), ale tylko jeśli użytkownik wcześniej o nią poprosił
async function refreshBrowserRegistration() {
  if (process.platform !== 'win32' || slot.n !== 0) return;
  try {
    const m = JSON.parse(fs.readFileSync(dbMarker, 'utf8'));
    if (m.exe === process.execPath && m.ver === app.getVersion()) return;
    if (await db.register(dbOpts())) fs.writeFileSync(dbMarker, JSON.stringify({ ver: app.getVersion(), exe: process.execPath }));
  } catch {}
}
app.on('window-all-closed', () => app.quit());
