// ---------- start ----------
try{ window.api.onXd(xdHandle); }catch{}
cw.addEventListener('dom-ready',()=>injS(cw));
try{ $('wmin').onclick=()=>window.api.winCtl('min'); $('wmax').onclick=()=>window.api.winCtl('max'); $('wcls').onclick=()=>window.api.winCtl('close');
  window.api.onWinState(v=>document.body.classList.toggle('maxd',v)); window.api.winState().then(v=>document.body.classList.toggle('maxd',v)); }catch(e){ console.warn('Zły preload.js',e); }
applySettings();
pwSet(); pushKeys();
setPanel(!!S.panel); if(S.panel) cw.setAttribute('src','https://claude.ai/new');
switchFolder(S.folders.find(f=>f.id===S.cur)?S.cur:S.folders[0].id);
renderBar(); S.aw.open.slice().forEach(id=>openApp(id));
applyLang();
bootGo();
