// Przydział profilu (userData) dla każdej uruchomionej instancji.
// Dwa procesy Electrona na jednym folderze danych blokują sobie magazyn Chromium (localStorage, IndexedDB, cookies, cache),
// przez co druga instancja potrafi wisieć kilkanaście sekund. Pierwsza instancja zostaje na dotychczasowym profilu,
// kolejne dostają własne (…-2, …-3), zajęte sloty rozpoznajemy po plikach .lock z numerem PID.
const fs = require('fs');
const path = require('path');
const alive = pid => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
function claimSlot(base, pid = process.pid) {
  for (let n = 0; n < 16; n++) {
    const suffix = n ? '-' + (n + 1) : '';
    const dir = base + suffix, lock = base + suffix + '.lock';
    try { fs.mkdirSync(path.dirname(lock), { recursive: true }); fs.writeFileSync(lock, String(pid), { flag: 'wx' }); return { n, dir, lock }; }
    catch (e) {
      if (e.code !== 'EEXIST') return { n: 0, dir: base, lock: null };   // brak uprawnień itp.: zachowanie jak dotąd
      let other = 0; try { other = parseInt(fs.readFileSync(lock, 'utf8'), 10); } catch {}
      if (!other || other === pid || !alive(other)) { try { fs.writeFileSync(lock, String(pid)); return { n, dir, lock }; } catch {} }   // zamek po zamkniętej/zawieszonej instancji
    }
  }
  return { n: 0, dir: base, lock: null };
}
function release(slot, pid = process.pid) { try { if (slot && slot.lock && fs.readFileSync(slot.lock, 'utf8') === String(pid)) fs.unlinkSync(slot.lock); } catch {} }
module.exports = { claimSlot, release };
