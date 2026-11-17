// ---------- pipeta: wybór koloru z ekranu (v49.7) ----------
// Panel ustawień się chowa, robimy zrzut okna (oraz osobny zrzut aktywnej strony, żeby na pewno była widoczna), pokazujemy go pod kursorem z lupą, a kliknięcie zwraca kolor piksela.
const EYD_ICON='<svg viewBox="0 0 24 24"><path d="M20.71 5.63l-2.34-2.34a1 1 0 0 0-1.41 0l-3.12 3.12-1.41-1.42-1.42 1.42 1.41 1.41L3 17.25V21h3.75l8.83-8.83 1.41 1.41 1.42-1.41-1.42-1.42 3.12-3.12a1 1 0 0 0 .01-1.41zM5.21 19 5 18.79l8.58-8.58.7.7L6.71 19H5.21z"/></svg>';
const eydImg=url=>new Promise(res=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=()=>res(null); i.src=url; });
async function eydShot(){   // zrzut całego okna + zrzut strony w karcie wklejony w jej prostokąt
  const cap=await window.api.screenCapture(); if(!cap) return null; const base=await eydImg(cap.url); if(!base) return null;
  const cv=document.createElement('canvas'); cv.width=base.naturalWidth; cv.height=base.naturalHeight; const g=cv.getContext('2d'); g.drawImage(base,0,0);
  try{ const t=T(), w=t&&views[t.id]; if(w&&home.style.display==='none'&&window.api.screenCaptureWc){ const r=w.getBoundingClientRect(), pc=await window.api.screenCaptureWc(w.getWebContentsId()), pi=pc&&await eydImg(pc.url);
      if(pi&&r.width>0){ const k=cv.width/innerWidth; g.drawImage(pi,Math.round(r.left*k),Math.round(r.top*k),Math.round(r.width*k),Math.round(r.height*k)); } } }catch{}
  return cv;
}
function pickScreenColor(){
  return new Promise(async res=>{
    if(!window.api||!window.api.screenCapture){ res(null); return; }
    try{ if(typeof DLOPEN!=='undefined'&&DLOPEN) dlToggle(false); }catch{}
    const set=$('set'), was=set.classList.contains('open'); set.classList.remove('open');
    await new Promise(r=>setTimeout(r,380));   // czekamy, aż panel ustawień zjedzie z ekranu
    const cv=await eydShot(), restore=hexv=>{ if(was) set.classList.add('open'); res(hexv||null); };
    if(!cv){ restore(null); return; }
    const g=cv.getContext('2d',{willReadFrequently:true}), o=document.createElement('div'); o.id='eyd';
    o.innerHTML='<div id="eydb"></div><div id="eydl"><canvas width="132" height="132"></canvas><i></i></div><div id="eydh"></div>'; document.body.appendChild(o);
    o.firstChild.textContent=t('Najedź na wybrany kolor i kliknij, aby go skopiować. Esc — anuluj.');
    o.style.backgroundImage='url("'+cv.toDataURL('image/png')+'")';
    const lc=o.querySelector('canvas').getContext('2d'), lens=o.querySelector('#eydl'), lab=o.querySelector('#eydh'); let cur=null;
    const at=e=>{ const k=cv.width/innerWidth, sx=Math.min(cv.width-1,Math.max(0,Math.floor(e.clientX*k))), sy=Math.min(cv.height-1,Math.max(0,Math.floor(e.clientY*k))), d=g.getImageData(sx,sy,1,1).data; return {sx,sy,hex:hex([d[0],d[1],d[2]])}; };
    const move=e=>{ const p=at(e); cur=p.hex; lens.style.display=lab.style.display='block'; lens.style.left=(e.clientX-66)+'px'; lens.style.top=(e.clientY-66)+'px'; lab.style.left=(e.clientX-40)+'px'; lab.style.top=(e.clientY+74)+'px';
      lc.imageSmoothingEnabled=false; lc.clearRect(0,0,132,132); lc.drawImage(cv,p.sx-5,p.sy-5,11,11,0,0,132,132);   // 11×11 pikseli powiększone 12×
      lc.strokeStyle='#000'; lc.lineWidth=3; lc.strokeRect(60,60,12,12); lc.strokeStyle='#fff'; lc.lineWidth=1.5; lc.strokeRect(60,60,12,12);
      lab.textContent=p.hex; lab.style.background=p.hex; const q=unhex(p.hex); lab.style.color=(0.2126*q[0]+0.7152*q[1]+0.0722*q[2])/255>.55?'#000':'#fff'; };
    const done=hv=>{ document.removeEventListener('keydown',kd,true); o.remove(); restore(hv); };
    const kd=e=>{ if(e.key==='Escape'){ e.preventDefault(); e.stopPropagation(); done(null); } };
    document.addEventListener('keydown',kd,true);
    o.addEventListener('mousemove',move); o.addEventListener('click',e=>{ move(e); done(cur); }); o.addEventListener('contextmenu',e=>{ e.preventDefault(); done(null); });
  });
}
// pipeta dla koloru z listy motywu (l='bg') lub akcentu (l='ac'): ustawia RGB, odcień oraz neutralne nasycenie/jasność, wraca do ustawień
async function eyedrop(l,i){
  const s=S.settings; if(l==='ac') s.accSel=i; else s.bgSel=i;
  const h=await pickScreenColor();
  if(h){ const c=unhex(h);
    if(l==='ac'){ accSet(h); }
    else { const b=curBg(); [b.r,b.g,b.b]=c; b.sat=50; b.bri=50; holdHue(); } }
  renderSet(); if(h){ applySettings(); save(); }
}
