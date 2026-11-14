'use strict';
// Sejf haseł: dane są szyfrowane przez system (Electron safeStorage: DPAPI w Windows) i trzymane w pliku vault.bin.
// Szyfrowanie chroni plik przed odczytem z innego konta lub komputera, ale nie przed kimś, kto korzysta z Twojej sesji Windows.
const fs = require('fs');
const crypto = require('crypto');

class Vault {
  constructor(file, cipher) { this.file = file; this.c = cipher; this.d = { v: 1, logins: [], never: [] }; this.load(); }
  get available() { try { return !!this.c && !!this.c.ok(); } catch { return false; } }
  load() {
    if (!this.available) return;
    try { const j = JSON.parse(this.c.dec(fs.readFileSync(this.file))); if (j && Array.isArray(j.logins)) this.d = { v: 1, logins: j.logins, never: Array.isArray(j.never) ? j.never : [] }; } catch { /* brak lub uszkodzony plik: zaczynamy od pustego */ }
  }
  save() { if (!this.available) return false; try { fs.writeFileSync(this.file + '.tmp', this.c.enc(JSON.stringify(this.d))); fs.renameSync(this.file + '.tmp', this.file); return true; } catch { return false; } }
  pub(l) { return { id: l.id, origin: l.origin, user: l.user, t: l.t }; }
  list() { return this.d.logins.map(l => this.pub(l)).sort((a, b) => a.origin.localeCompare(b.origin) || a.user.localeCompare(b.user)); }
  forOrigin(o) { return this.d.logins.filter(l => l.origin === o).map(l => ({ id: l.id, user: l.user })); }
  state(o) { return { available: this.available, never: this.d.never.includes(o), entries: this.forOrigin(o) }; }
  // zwraca dane tylko dla pasującego adresu witryny (ochrona przed wyłudzeniem przez inną stronę)
  fill(id, origin) { const l = this.d.logins.find(x => x.id === id); return l && l.origin === origin ? { user: l.user, pass: l.pass } : null; }
  reveal(id) { const l = this.d.logins.find(x => x.id === id); return l ? l.pass : null; }
  save1({ origin, user, pass }) {
    if (!this.available || !/^https?:\/\//.test(origin) || !pass) return { ok: false };
    const u = String(user || ''), ex = this.d.logins.find(l => l.origin === origin && l.user === u);
    if (ex) { if (ex.pass === pass) return { ok: true, same: true }; ex.pass = pass; ex.t = Date.now(); this.save(); return { ok: true, updated: true }; }
    this.d.logins.push({ id: crypto.randomBytes(8).toString('hex'), origin, user: u, pass, t: Date.now() }); this.save(); return { ok: true, created: true };
  }
  del(id) { this.d.logins = this.d.logins.filter(l => l.id !== id); this.save(); }
  clear() { this.d.logins = []; this.save(); }
  never(o) { if (!this.d.never.includes(o)) { this.d.never.push(o); this.save(); } }
  unnever(o) { this.d.never = this.d.never.filter(x => x !== o); this.save(); }
}
const safeCipher = ss => ({ ok: () => ss.isEncryptionAvailable(), enc: s => ss.encryptString(s), dec: b => ss.decryptString(b) });
function register(ipcMain, vault) {
  ipcMain.handle('vault-state', (_e, o) => vault.state(String(o)));
  ipcMain.handle('vault-fill', (_e, id, o) => vault.fill(String(id), String(o)));
  ipcMain.handle('vault-save', (_e, x) => vault.save1(x || {}));
  ipcMain.handle('vault-list', () => ({ available: vault.available, logins: vault.list() }));
  ipcMain.handle('vault-reveal', (_e, id) => vault.reveal(String(id)));
  ipcMain.handle('vault-del', (_e, id) => { vault.del(String(id)); return vault.list(); });
  ipcMain.handle('vault-clear', () => { vault.clear(); return []; });
  ipcMain.handle('vault-never', (_e, o) => { vault.never(String(o)); return true; });
}
module.exports = { Vault, safeCipher, register };
