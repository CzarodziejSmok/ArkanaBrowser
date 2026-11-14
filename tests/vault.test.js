'use strict';
const { eq, ok } = require('./helpers'), V = require('../vault'), crypto = require('crypto'), fs = require('fs'), os = require('os'), path = require('path'), EventEmitter = require('events');
const mkCipher = (avail = true) => { const key = crypto.randomBytes(32); return { ok: () => avail, enc: s => { const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', key, iv), e = Buffer.concat([c.update(s, 'utf8'), c.final()]); return Buffer.concat([iv, c.getAuthTag(), e]); }, dec: b => { const d = crypto.createDecipheriv('aes-256-gcm', key, b.subarray(0, 12)); d.setAuthTag(b.subarray(12, 28)); return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8'); } }; };
module.exports = async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arkana-vault-')), f = path.join(dir, 'v.bin'), c = mkCipher(), v = new V.Vault(f, c), O = 'https://example.com';
  eq(v.save1({ origin: O, user: 'jan', pass: 'tajne1' }), { ok: true, created: true }, 'zapis nowego loginu'); eq(v.save1({ origin: O, user: 'jan', pass: 'tajne1' }), { ok: true, same: true }, 'to samo hasło: bez zmian'); eq(v.save1({ origin: O, user: 'jan', pass: 'nowe2' }), { ok: true, updated: true }, 'zmiana hasła aktualizuje wpis');
  eq(v.list().length, 1, 'jeden wpis po aktualizacji'); ok(!('pass' in v.list()[0]), 'lista nie zawiera haseł');
  const raw = fs.readFileSync(f); ok(!raw.includes('tajne') && !raw.includes('nowe2') && !raw.includes('example.com'), 'plik na dysku jest zaszyfrowany (brak jawnego hasła i adresu)');
  const v2 = new V.Vault(f, c); eq(v2.list().length, 1, 'odczyt po ponownym otwarciu'); const id = v2.list()[0].id;
  eq(v2.fill(id, O), { user: 'jan', pass: 'nowe2' }, 'wypełnianie dla właściwej witryny'); eq(v2.fill(id, 'https://zlosliwa.com'), null, 'wypełnianie dla innej witryny jest odrzucone (ochrona przed wyłudzeniem)'); eq(v2.fill(id, 'http://example.com'), null, 'inny schemat (http) też odrzucony');
  eq(v2.reveal(id), 'nowe2', 'podgląd hasła'); eq(v2.state(O), { available: true, never: false, entries: [{ id, user: 'jan' }] }, 'stan witryny');
  v2.never(O); eq(v2.state(O).never, true, 'nigdy dla tej witryny'); v2.unnever(O); eq(v2.state(O).never, false, 'cofnięcie "nigdy"');
  eq(v2.save1({ origin: 'ftp://x', user: 'a', pass: 'b' }), { ok: false }, 'tylko http(s)'); eq(v2.save1({ origin: O, user: 'a', pass: '' }), { ok: false }, 'puste hasło odrzucone');
  const bad = new V.Vault(f, mkCipher()); eq(bad.list(), [], 'inny klucz szyfrowania: pusty sejf, bez wyjątku');
  const off = new V.Vault(path.join(dir, 'x.bin'), mkCipher(false)); eq([off.available, off.save1({ origin: O, user: 'a', pass: 'b' })], [false, { ok: false }], 'brak szyfrowania w systemie: sejf wyłączony');
  v2.del(id); eq(v2.list(), [], 'usuwanie');
  const ipc = new EventEmitter(); ipc.h = {}; ipc.handle = (n, fn) => { ipc.h[n] = fn; }; V.register(ipc, v2); await ipc.h['vault-save']({}, { origin: O, user: 'u', pass: 'p' }); const l = await ipc.h['vault-list'](); eq([l.available, l.logins.length], [true, 1], 'IPC: zapis i lista');
  fs.rmSync(dir, { recursive: true, force: true });
};
