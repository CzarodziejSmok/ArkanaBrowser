// Automatyczne aktualizacje (proces główny).
// • Wersja zainstalowana (instalator NSIS): electron-updater pobiera wydanie z GitHub Releases, weryfikuje sumę SHA-512
//   z pliku latest.yml i instaluje je przy zamknięciu programu (albo od razu na życzenie).
// • Wersja nieinstalowana (npm start / plik .bat): tylko sprawdzanie przez API GitHuba i odnośnik do strony wydania.
// Repozytorium bierzemy z package.json → build.publish (owner, repo). Moduł electron-updater ładujemy leniwie,
// więc przeglądarka działa także tam, gdzie go nie zainstalowano.
const cmp = (a, b) => {   // porównanie wersji 1.2.3 (prefiks „v” i przyrostek -beta ignorowane)
  const p = s => String(s).replace(/^v/i, '').split('-')[0].split('.').map(n => parseInt(n, 10) || 0);
  const x = p(a), y = p(b);
  for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0) ? 1 : -1; }
  return 0;
};
function repoCfg() {
  try {
    const pk = require('./package.json');
    const pb = [].concat((pk.build && pk.build.publish) || []).find(p => p.provider === 'github');
    if (pb && pb.owner && pb.repo && !/^(TWOJ|YOUR|OWNER)/i.test(pb.owner)) return { owner: pb.owner, repo: pb.repo };
  } catch {}
  return null;
}
const short = e => String((e && e.message) || e || '').split('\n')[0].slice(0, 160);
const okUrl = u => typeof u === 'string' && /^https:\/\/github\.com\//.test(u);

function init({ app, ipcMain, BrowserWindow, shell, net, isSecondary, primary = true, load }) {
  const st = { state: primary ? 'idle' : 'secondary', current: app.getVersion(), version: null, percent: 0, err: '', url: '', packaged: app.isPackaged, manual: !app.isPackaged };
  const cfg = { auto: true, dl: true };
  let au = null, busy = false, t0 = null, iv = null, firstDone = false;
  const set = p => {
    Object.assign(st, p);
    for (const w of BrowserWindow.getAllWindows()) {
      if (w.isDestroyed() || isSecondary(w.webContents.id)) continue;   // okna oderwane są jednorazowe
      try { w.webContents.send('upd-event', { ...st }); } catch {}
    }
  };
  const relUrl = v => { const rc = repoCfg(); return rc ? `https://github.com/${rc.owner}/${rc.repo}/releases/tag/v${String(v).replace(/^v/i, '')}` : ''; };

  function updater() {
    if (au) return au;
    const { autoUpdater } = load ? load() : require('electron-updater');
    autoUpdater.autoDownload = false;            // pobieranie uruchamiamy sami, zależnie od ustawienia
    autoUpdater.autoInstallOnAppQuit = true;     // pobrana aktualizacja instaluje się przy zamknięciu przeglądarki
    autoUpdater.allowDowngrade = false; autoUpdater.allowPrerelease = false;
    autoUpdater.logger = null;
    autoUpdater.on('update-available', i => { busy = false; set({ state: 'available', version: i.version, url: relUrl(i.version), err: '' }); if (cfg.dl) download(); });
    autoUpdater.on('update-not-available', () => { busy = false; set({ state: 'none', version: null, err: '' }); });
    autoUpdater.on('download-progress', p => set({ state: 'downloading', percent: Math.round(p.percent || 0) }));
    autoUpdater.on('update-downloaded', i => { busy = false; set({ state: 'ready', version: i.version, percent: 100 }); });
    autoUpdater.on('error', e => { busy = false; if (st.state !== 'ready') set({ state: 'error', err: short(e) }); });
    return au = autoUpdater;
  }
  async function checkApi(rc) {   // wersja nieinstalowana: tylko informacja o nowym wydaniu
    try {
      const r = await net.fetch(`https://api.github.com/repos/${rc.owner}/${rc.repo}/releases/latest`, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'claude-browser-updater' } });
      if (r.status === 404) return set({ state: 'error', err: 'Brak opublikowanych wydań' });
      if (!r.ok) return set({ state: 'error', err: 'GitHub: HTTP ' + r.status });
      const j = await r.json(), tag = String(j.tag_name || '');
      if (cmp(tag, st.current) > 0) set({ state: 'available', version: tag.replace(/^v/i, ''), url: okUrl(j.html_url) ? j.html_url : relUrl(tag), err: '' });
      else set({ state: 'none', version: null, err: '' });
    } catch (e) { set({ state: 'error', err: short(e) }); }
  }
  async function check() {
    if (!primary) return set({ state: 'secondary' });
    const rc = repoCfg(); if (!rc) return set({ state: 'unconfigured' });
    if (busy || st.state === 'downloading' || st.state === 'ready') return;
    busy = true; set({ state: 'checking', err: '' });
    try {
      if (!app.isPackaged) await checkApi(rc);
      else await updater().checkForUpdates();
    } catch (e) { if (st.state !== 'error') set({ state: 'error', err: short(e) }); }   // zdarzenie „error” już ustawiło komunikat
    busy = false;
  }
  function download() {
    if (!app.isPackaged || st.state !== 'available') return;
    set({ state: 'downloading', percent: 0 });
    updater().downloadUpdate().catch(e => { if (st.state !== 'error') set({ state: 'error', err: short(e) }); });
  }
  function schedule() {
    clearInterval(iv); iv = null;
    if (!primary || !cfg.auto) { clearTimeout(t0); t0 = null; return; }
    if (!firstDone && !t0) t0 = setTimeout(() => { firstDone = true; t0 = null; check(); }, 8000);   // po starcie, gdy okno już działa
    iv = setInterval(() => { if (cfg.auto) check(); }, 4 * 3600 * 1000);
  }
  ipcMain.handle('upd-info', () => ({ ...st }));
  ipcMain.handle('upd-check', () => { check(); return { ...st }; });
  ipcMain.handle('upd-download', () => { download(); return { ...st }; });
  ipcMain.handle('upd-install', () => { if (st.state === 'ready' && app.isPackaged && au) setImmediate(() => au.quitAndInstall(true, true)); return { ...st }; });
  ipcMain.handle('upd-open', () => { if (okUrl(st.url)) shell.openExternal(st.url); return true; });
  ipcMain.on('upd-set', (e, c) => { if (isSecondary(e.sender.id) || !c) return; cfg.auto = c.auto !== false; cfg.dl = c.dl !== false; schedule(); });   // ustawienia przyjmujemy tylko z okna głównego
  return { st, cfg, check, download, schedule };
}
module.exports = { init, cmp, repoCfg };
