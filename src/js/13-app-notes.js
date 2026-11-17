// ---------- aplikacja: notatnik ----------
function mountNotes(el,w){
  const D=(S.aw.data.notes=S.aw.data.notes||{list:[],cur:null,sl:true});
  if(!D.list.length){ const n={id:uid(),c:'',u:Date.now()}; D.list.push(n); D.cur=n.id; }
  if(!D.list.find(n=>n.id===D.cur)) D.cur=D.list[0].id;
  let q='';
  el.innerHTML=`<div class="nt"><div class="nt-l"><div class="nt-lt"><input class="nt-s" placeholder="Szukaj w notatkach…"><button class="nt-n" title="Nowa notatka">＋</button></div><div class="nt-ls"></div></div>
    <div class="nt-e"><div class="nt-bar"><button class="nt-t" title="Lista notatek">☰</button><input class="nt-ti" maxlength="80" spellcheck="false"><button class="nt-lk" title="Lista zadań (pola do odznaczania)"><svg viewBox="0 0 24 24"><path d="m4 7 1.5 1.5L8 5.8M4 13l1.5 1.5L8 11.8M11 7h9M11 13h9M4 19h.01M11 19h9"/></svg></button><button class="nt-em" title="Emoji">😊</button><button class="nt-dp" title="Duplikuj notatkę">⧉</button><button class="nt-io-b" title="Importuj / eksportuj">⇅</button><button class="nt-d" title="Usuń notatkę">🗑</button></div>
    <textarea class="nt-ta" spellcheck="false" placeholder="Zacznij pisać…"></textarea><div class="nt-li"></div><div class="nt-f"><span class="nt-c"></span><button class="nt-cl">Usuń wykonane</button></div><div class="nt-pk"></div><div class="nt-io"></div><input type="file" class="nt-fi" multiple hidden accept=".txt,.md,.markdown,.csv,.tsv,.json,.log,.html,.htm,.xml,.rtf,.ini,.cfg,.yml,.yaml,.tex,.srt,.vtt,.bat,.js,.css,text/*"></div></div>`;
  const root=el.firstElementChild, io=root.querySelector('.nt-io'), fi=root.querySelector('.nt-fi'), ls=root.querySelector('.nt-ls'), ta=root.querySelector('.nt-ta'), ti=root.querySelector('.nt-ti'), cc=root.querySelector('.nt-c'), pk=root.querySelector('.nt-pk'), sr=root.querySelector('.nt-s'), li=root.querySelector('.nt-li'), lk=root.querySelector('.nt-lk'), lcl=root.querySelector('.nt-cl');
  const EM='😀 😂 😍 🥰 😎 🤔 😴 😭 😡 👍 👎 🙏 👏 🎉 🔥 ⭐ 💡 ✅ ❌ ❤️ 💔 📌 📎 📝 📅 ⏰ 💼 🏠 🛒 ✈️ 🍕 ☕ 🎵 📚 💻 📱 🔒 🔑 🌈 ☀️ 🌙 🌿 🐱 🐶 🚀 💬 🎯'.split(' ');
  pk.innerHTML=EM.map(e=>`<button>${e}</button>`).join('');
  const cur=()=>D.list.find(n=>n.id===D.cur);
  // tryb listy zadań: pozycje są zapisane w tekście notatki jako wiersze "[ ] tekst" i "[x] tekst" (bez osobnej struktury, więc wyszukiwanie, kopiowanie i eksport działają jak zawsze)
  const LRE=/^\s*(?:[-*]\s*)?\[([ xX])\]\s?/, clean=x=>x.replace(LRE,'');
  const parseL=c=>c.split('\n').filter(x=>x.trim()).map(x=>{ const m=LRE.exec(x); return m?{d:m[1]!==' ',t:x.slice(m[0].length)}:{d:false,t:x.trim()}; });
  const joinL=a=>a.map(i=>(i.d?'[x] ':'[ ] ')+i.t).join('\n'), toTxt=c=>parseL(c).map(i=>i.d?'[x] '+i.t:i.t).join('\n');
  const prog=n=>{ const a=parseL(n.c); return [a.filter(i=>i.d).length,a.length]; };
  let items=[], lastIn=null;
  const first=n=>{ const l=(n.c.split('\n').map(clean).find(x=>x.trim())||'').trim(); return l?l.slice(0,40):t('Bez tytułu'); };
  const title=n=>n.t||first(n);
  const sub=n=>{ const ln=n.c.split('\n').map(clean).filter(x=>x.trim()); return (ln[1]||'').trim(); };
  const when=n=>new Date(n.u).toLocaleString(IL(),{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
  const list=()=>{ const f=q.toLowerCase(); ls.innerHTML=[...D.list].sort((a,b)=>b.u-a.u).filter(n=>!f||(n.c+' '+(n.t||'')).toLowerCase().includes(f))
    .map(n=>`<div class="ni${n.id===D.cur?' on':''}" data-id="${n.id}"><b>${esc(title(n))}</b><small>${esc(when(n))}${n.l?' · ✓ '+prog(n).join('/'):''}${sub(n)?' · '+esc(sub(n).slice(0,24)):''}</small></div>`).join(''); };
  const meta=()=>{ const n=cur(); ti.value=n.t||''; ti.placeholder=first(n); cc.textContent=n.l?t('Wykonano {a} z {b}').replace('{a}',prog(n)[0]).replace('{b}',prog(n)[1]):[...n.c].length+' '+t('znaków'); };
  const show=()=>{ const n=cur(), L=!!n.l; ta.value=n.c; root.classList.toggle('lm',L); lk.classList.toggle('on',L); if(L){ items=parseL(n.c); rItems(); } meta(); list(); root.classList.toggle('sl',!!D.sl); };
  const select=id=>{ D.cur=id; saveSoon(); show(); if(root.classList.contains('narrow')){ D.sl=false; root.classList.remove('sl'); } if(!cur().l) ta.focus(); };
  ta.addEventListener('input',()=>{ const n=cur(); n.c=ta.value; n.u=Date.now(); meta(); list(); saveSoon(); });
  sr.addEventListener('input',()=>{ q=sr.value; list(); });
  ti.addEventListener('input',()=>{ const n=cur(), v=ti.value.trim(); if(v) n.t=v; else delete n.t; list(); saveSoon(); });
  ti.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); (cur().l?(li.querySelector('.nt-new')||ta):ta).focus(); } });
  root.querySelector('.nt-dp').onclick=()=>{ const n=cur(), c={id:uid(),c:n.c,l:n.l,t:title(n)+' ('+t('kopia')+')',u:Date.now()}; D.list.push(c); select(c.id); };
  ls.addEventListener('click',e=>{ const it=e.target.closest('.ni'); if(it) select(it.dataset.id); });
  root.querySelector('.nt-n').onclick=()=>{ const n={id:uid(),c:'',u:Date.now()}; D.list.push(n); q=''; sr.value=''; select(n.id); };
  root.querySelector('.nt-t').onclick=()=>{ D.sl=!D.sl; root.classList.toggle('sl',D.sl); saveSoon(); };
  root.querySelector('.nt-em').onclick=e=>{ e.stopPropagation(); pk.classList.toggle('open'); };
  root.addEventListener('mousedown',e=>{ if(!e.target.closest('.nt-pk,.nt-em')) pk.classList.remove('open'); if(!e.target.closest('.nt-io,.nt-io-b')) io.classList.remove('open'); });
  pk.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return;
    const tg=root.classList.contains('lm')?((lastIn&&lastIn.isConnected)?lastIn:li.querySelector('.nt-new')):ta, a=tg.selectionStart, z=tg.selectionEnd;
    tg.setRangeText(b.textContent,a,z,'end'); tg.dispatchEvent(new Event('input',{bubbles:true})); tg.focus(); });
  root.querySelector('.nt-d').onclick=async()=>{ const n=cur();
    if(n.c.trim()&&!(await ask(t('Usunąć notatkę?'),t('Tej operacji nie można cofnąć.'),'Usuń'))) return;
    D.list=D.list.filter(x=>x.id!==n.id); if(!D.list.length) D.list.push({id:uid(),c:'',u:Date.now()}); D.cur=D.list[0].id; saveSoon(); show(); };
  new ResizeObserver(()=>{ const nar=el.clientWidth<420; if(nar!==root.classList.contains('narrow')){ root.classList.toggle('narrow',nar); if(nar){ D.sl=false; root.classList.remove('sl'); } } }).observe(el);
  const rItems=focus=>{
    li.innerHTML=items.map((it,i)=>`<div class="nt-it${it.d?' done':''}" data-i="${i}"><label class="nt-ck"><input type="checkbox" ${it.d?'checked':''}><i></i></label><input class="nt-tx" value="${esc(it.t)}" spellcheck="false"><button class="nt-x" title="Usuń pozycję">×</button></div>`).join('')
      +'<div class="nt-ad"><span>+</span><input class="nt-new" placeholder="Dodaj pozycję..."></div>';
    if(focus!==undefined&&focus!==null){ const e=focus<0?li.querySelector('.nt-new'):li.querySelectorAll('.nt-tx')[focus]; if(e){ e.focus(); const L=e.value.length; try{ e.setSelectionRange(L,L); }catch{} } }
  };
  const sync=()=>{ const n=cur(); n.c=joinL(items); n.u=Date.now(); meta(); list(); saveSoon(); };
  const addNew=inp=>{ const v=inp.value.trim(); if(!v) return false; items.push({d:false,t:v}); inp.value=''; sync(); return true; };
  lk.onclick=()=>{ const n=cur(); n.l=!n.l; n.c=n.l?joinL(parseL(n.c)):toTxt(n.c); n.u=Date.now(); saveSoon(); show(); if(n.l) (li.querySelector('.nt-new')).focus(); else ta.focus(); };
  lcl.onclick=()=>{ items=items.filter(i=>!i.d); sync(); rItems(); };
  li.addEventListener('focusin',e=>{ if(e.target.matches('.nt-tx,.nt-new')) lastIn=e.target; });
  li.addEventListener('change',e=>{ const row=e.target.closest('.nt-it');
    if(row&&e.target.type==='checkbox'){ const i=+row.dataset.i; items[i].d=e.target.checked; row.classList.toggle('done',items[i].d); sync(); }
    else if(e.target.classList.contains('nt-new')){ if(addNew(e.target)) rItems(); } });
  li.addEventListener('input',e=>{ const row=e.target.closest('.nt-it'); if(row&&e.target.classList.contains('nt-tx')){ items[+row.dataset.i].t=e.target.value; sync(); } });
  li.addEventListener('click',e=>{ const x=e.target.closest('.nt-x'); if(x){ const i=+x.closest('.nt-it').dataset.i; items.splice(i,1); sync(); rItems(Math.min(i,items.length-1)); } });
  li.addEventListener('keydown',e=>{
    if(e.isComposing) return; const inp=e.target;
    if(inp.classList.contains('nt-new')){
      if(e.key==='Enter'){ e.preventDefault(); if(addNew(inp)) rItems(-1); }
      else if((e.key==='Backspace'||e.key==='ArrowUp')&&!inp.value&&items.length){ e.preventDefault(); li.querySelectorAll('.nt-tx')[items.length-1].focus(); }
      return; }
    if(!inp.classList.contains('nt-tx')) return; const i=+inp.closest('.nt-it').dataset.i;
    if(e.key==='Enter'){ e.preventDefault(); items.splice(i+1,0,{d:false,t:''}); sync(); rItems(i+1); }
    else if(e.key==='Backspace'&&!inp.value){ e.preventDefault(); items.splice(i,1); sync(); rItems(i>0?i-1:(items.length?0:-1)); }
    else if(e.key==='ArrowUp'&&i>0){ e.preventDefault(); li.querySelectorAll('.nt-tx')[i-1].focus(); }
    else if(e.key==='ArrowDown'){ e.preventDefault(); const nx=li.querySelectorAll('.nt-tx')[i+1]; (nx||li.querySelector('.nt-new')).focus(); } });
  show();
  // import i eksport plików tekstowych (v48): .txt, .md, .csv, .json, .html i inne pliki tekstowe; kopia zapasowa wszystkich notatek w .json wraca przy imporcie
  const ioMenu=sub=>{ io.dataset.sub=sub?'1':''; io.innerHTML=(sub?[['back','← Wstecz'],['-'],['txt','Ta notatka jako .txt'],['md','Ta notatka jako .md'],['html','Ta notatka jako .html'],['-'],['all','Wszystkie jako jeden .txt'],['bak','Kopia wszystkich (.json)']]:[['imp','Importuj pliki…'],['sub','Eksportuj…']]).map(([k,l])=>k==='-'?'<hr>':`<button data-io="${k}">${l}</button>`).join(''); };   // menu główne: Importuj / Eksportuj…; „Eksportuj…” otwiera listę formatów
  ioMenu(false);
  const safe=x=>(x||'').replace(/[\\/:*?"<>|\r\n]+/g,' ').trim().slice(0,60)||t('Notatka');
  const dl=(name,txt,mime)=>{ const b=new Blob(['\ufeff'+txt],{type:mime+';charset=utf-8'}), u=URL.createObjectURL(b), a=document.createElement('a'); a.href=u; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),4000); toast(t('Zapisano')+': '+name); };
  const plain=n=>n.l?parseL(n.c).map(i=>(i.d?'[x] ':'[ ] ')+i.t).join('\n'):n.c;
  const htmlOf=n=>`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(title(n))}</title></head><body><h1>${esc(title(n))}</h1>${n.l?'<ul style="list-style:none;padding:0">'+parseL(n.c).map(i=>`<li>${i.d?'☑':'☐'} ${esc(i.t)}</li>`).join('')+'</ul>':'<pre style="white-space:pre-wrap;font:inherit">'+esc(n.c)+'</pre>'}</body></html>`;
  const stripHtml=h=>{ try{ const d=new DOMParser().parseFromString(h,'text/html'); d.querySelectorAll('script,style,head').forEach(x=>x.remove()); return (d.body.innerText||d.body.textContent||'').replace(/\n{3,}/g,'\n\n').trim(); }catch{ return h; } };
  const addNote=(name,c,l)=>{ const n={id:uid(),c,u:Date.now()}; if(name) n.t=name; if(l) n.l=true; D.list.push(n); return n; };
  const imp=async files=>{ let k=0, last=null;
    for(const f of files){ let tx; try{ tx=await f.text(); }catch{ continue; } if(/[\u0000]/.test(tx.slice(0,2000))){ toast(t('Pominięto plik binarny')+': '+f.name); continue; }
      tx=tx.replace(/^\ufeff/,'').replace(/\r\n?/g,'\n'); const ext=(f.name.split('.').pop()||'').toLowerCase(), base=f.name.replace(/\.[^.]+$/,'');
      if(ext==='json'){ let j=null; try{ j=JSON.parse(tx); }catch{} const arr=j&&Array.isArray(j.notes)?j.notes:(Array.isArray(j)?j:null);
        if(arr&&arr.every(x=>x&&typeof x==='object'&&typeof x.c==='string')){ arr.forEach(x=>{ last=addNote(typeof x.t==='string'?x.t.slice(0,80):'',x.c,!!x.l); k++; }); continue; } }
      if(ext==='html'||ext==='htm') tx=stripHtml(tx);
      last=addNote(base.slice(0,80),tx,false); k++; }
    if(k){ q=''; sr.value=''; select(last.id); toast(t('Zaimportowano notatek')+': '+k); } else toast(t('Nic nie zaimportowano')); };
  const exp=k=>{ const n=cur();
    if(k==='txt') dl(safe(title(n))+'.txt',plain(n),'text/plain');
    else if(k==='md') dl(safe(title(n))+'.md','# '+title(n)+'\n\n'+(n.l?parseL(n.c).map(i=>'- ['+(i.d?'x':' ')+'] '+i.t).join('\n'):n.c)+'\n','text/markdown');
    else if(k==='html') dl(safe(title(n))+'.html',htmlOf(n),'text/html');
    else if(k==='all') dl('notatki.txt',[...D.list].sort((a,b)=>b.u-a.u).map(x=>title(x)+'\n'+'='.repeat(Math.min(40,Math.max(3,title(x).length)))+'\n'+plain(x)).join('\n\n\n')+'\n','text/plain');
    else if(k==='bak') dl('notatki-kopia.json',JSON.stringify({arkana:'notes',v:1,notes:D.list.map(x=>({t:x.t||'',c:x.c,l:!!x.l,u:x.u}))},null,1),'application/json'); };
  root.querySelector('.nt-io-b').onclick=e=>{ e.stopPropagation(); pk.classList.remove('open'); if(!io.classList.contains('open')) ioMenu(false); io.classList.toggle('open'); };
  io.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const k=b.dataset.io; if(k==='sub'){ ioMenu(true); return; } if(k==='back'){ ioMenu(false); return; } io.classList.remove('open'); if(k==='imp') fi.click(); else exp(k); });
  fi.addEventListener('change',()=>{ const fs=[...fi.files]; fi.value=''; if(fs.length) imp(fs); });
  root.addEventListener('dragover',e=>{ if(e.dataTransfer&&[...e.dataTransfer.types].includes('Files')) e.preventDefault(); });
  root.addEventListener('drop',e=>{ const fs=e.dataTransfer&&[...e.dataTransfer.files]; if(fs&&fs.length){ e.preventDefault(); imp(fs); } });
}

