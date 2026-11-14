// ---------- logo Arkana: ikona aplikacji + krąg arkaniczny (runy, heksagram) ----------
const ARC_RUNES=[[[[0,0],[0,1]],[[0,.6],[.7,1]],[[0,.3],[.7,.7]]],[[[-.6,0],[-.6,1],[.6,.55],[.6,0]]],[[[0,0],[0,1]],[[0,.8],[.7,.55],[0,.3]]],[[[0,0],[0,1]],[[0,1],[.7,.7]],[[0,.65],[.7,.35]]],
  [[[0,0],[0,1],[.7,.78],[0,.5],[.7,0]]],[[[.6,.9],[-.4,.5],[.6,.1]]],[[[-.6,0],[.6,1]],[[-.6,1],[.6,0]]],[[[0,0],[0,1],[.7,.75],[0,.5]]],[[[-.6,0],[-.6,1]],[[.6,0],[.6,1]],[[-.6,.65],[.6,.35]]],
  [[[0,0],[0,1]],[[-.6,.75],[.6,.3]]],[[[0,0],[0,1]]],[[[0,0],[0,1]],[[0,.35],[-.6,.7],[0,1]]],[[[-.1,0],[-.1,1],[.6,.8],[.6,.5],[-.1,.3]]],[[[0,0],[0,1]],[[-.7,1],[0,.55],[.7,1]]],
  [[[-.4,1],[.4,.65],[-.4,.35],[.4,0]]],[[[0,0],[0,1]],[[-.6,.65],[0,1],[.6,.65]]],[[[-.1,0],[-.1,1],[.6,.78],[-.1,.5],[.6,.22],[-.1,0]]],[[[-.6,0],[-.6,1],[0,.55],[.6,1],[.6,0]]],[[[0,0],[0,1],[.6,.75]]],[[[0,.1],[.6,.5],[0,.9],[-.6,.5],[0,.1]]]];
function arcGeom(c,R,n){   // wspólna geometria dla SVG (interfejs) i canvasu (ikona paska zadań i animacji startu)
  const pt=(a,r)=>[c+Math.sin(a)*r, c-Math.cos(a)*r], runes=[];
  for(let k=0;k<n;k++){ const a=k*2*Math.PI/n, tpl=ARC_RUNES[(k*7)%ARC_RUNES.length], r0=R*.79, r1=R*.915, uw=R*.05;
    for(const pl of tpl) runes.push(pl.map(([u,v])=>{ const r=r0+(r1-r0)*v; return [c+Math.sin(a)*r+Math.cos(a)*u*uw, c-Math.cos(a)*r+Math.sin(a)*u*uw]; })); }
  const hex=[0,60].map(o=>[0,1,2].map(k=>pt((o+k*120)*Math.PI/180,R*.64))), rays=[...Array(8)].map((_,k)=>{ const a=k*Math.PI/4, a0=pt(a,R*.17), a1=pt(a,k%2?R*.4:R*.53); return [a0,a1]; });
  const dm=[0,1,2,3].map(k=>{ const a=k*Math.PI/2, p=pt(a,R), d=R*.07, q=pt(a,R+d), w=pt(a,R-d), s=[Math.cos(a)*d,Math.sin(a)*d]; return [q,[p[0]+s[0],p[1]+s[1]],w,[p[0]-s[0],p[1]-s[1]]]; });
  return {runes,hex,rays,dm,R}; }
function arcSvg(full){
  const G=arcGeom(60,57,24), f=v=>v.toFixed(1), P2=a=>a.map(p=>f(p[0])+','+f(p[1])).join(' ');
  const ru=G.runes.map(pl=>'M'+P2(pl).replace(/ /g,'L').replace(/,/g,' ')).join(''), ry=G.rays.map(([a,b])=>`M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`).join('');
  return `<svg class="arc${full?'':' s'}" viewBox="0 0 120 120" aria-hidden="true"><circle class="a-bg" cx="60" cy="60" r="57"/>`
    +(full?`<g class="arot"><circle class="a-th" cx="60" cy="60" r="53.8"/><path class="a-ru" d="${ru}"/><circle class="a-th" cx="60" cy="60" r="43"/>${G.dm.map(d=>`<polygon class="a-dm" points="${P2(d)}"/>`).join('')}</g>`:`<circle class="a-th" cx="60" cy="60" r="43"/>`)
    +`<g class="arot2">${G.hex.map(h=>`<polygon class="a-hx" points="${P2(h)}"/>`).join('')}</g><circle class="a-in" cx="60" cy="60" r="33"/><path class="a-bu" d="${ry}"/></svg>`; }
function arcInit(){ const b=document.querySelector('#brand .st'); if(b) b.outerHTML=arcSvg(false); const l=$('logo'); if(l){ l.innerHTML=arcSvg(true)+'<b>Arkana</b><span>.</span>'; } }
function drawIcon(){
  const c=document.createElement('canvas'); c.width=c.height=256; const g=c.getContext('2d');
  const bg=g.createLinearGradient(0,0,256,256); bg.addColorStop(0,P.panel2); bg.addColorStop(1,P.bg);
  g.fillStyle=bg; g.beginPath(); g.roundRect(8,8,240,240,58); g.fill(); g.lineWidth=5; g.strokeStyle=P.acc+'99'; g.stroke();
  g.translate(128,128); g.lineCap='round'; g.lineWidth=17; const gr=g.createLinearGradient(-80,-80,80,80); gr.addColorStop(0,P.acc); gr.addColorStop(1,P.acc2);
  g.strokeStyle=gr; g.shadowColor=P.acc; g.shadowBlur=22;
  for(let k=0;k<8;k++){ g.rotate(Math.PI/4); g.beginPath(); g.moveTo(0,-30); g.lineTo(0,k%2?-66:-88); g.stroke(); }
  return c.toDataURL('image/png');
}
// koło alchemiczne z animacji startu: rysowane jednorazowo na osobnym canvasie (z poświatą), potem tylko obracane i blendowane
function bootRing(R){
  const pad=Math.ceil(R*.18), n=Math.ceil(2*(R+pad)), c=document.createElement('canvas'); c.width=c.height=n; const g=c.getContext('2d'), m=n/2, G=arcGeom(m,R,24), lw=Math.max(1.3,R*.012);
  const path=(pts,close)=>{ g.beginPath(); pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1])); if(close) g.closePath(); }, ring=(r,w,col)=>{ g.lineWidth=w; g.strokeStyle=col; g.beginPath(); g.arc(m,m,r,0,6.2832); g.stroke(); };
  g.lineCap='round'; g.lineJoin='round';
  const rg=g.createRadialGradient(m,m,R*.2,m,m,R*1.12); rg.addColorStop(0,`rgba(${accRgb},0)`); rg.addColorStop(.7,`rgba(${accRgb},.16)`); rg.addColorStop(1,`rgba(${accRgb},0)`); g.fillStyle=rg; g.fillRect(0,0,n,n);
  g.shadowColor=P.acc; g.shadowBlur=R*.07; ring(R,lw*1.6,P.acc2); ring(R*.943,lw*.8,P.acc); ring(R*.755,lw,P.acc);
  g.strokeStyle=P.acc2; g.lineWidth=lw*1.25; for(const pl of G.runes){ path(pl); g.stroke(); }
  g.fillStyle=P.acc2; for(const d of G.dm){ path(d,true); g.fill(); }
  g.strokeStyle=P.acc; g.lineWidth=lw; for(const q of G.hex){ path(q,true); g.stroke(); }
  return c;
}
function sendIcon(){ try{ window.api.setIcon(drawIcon()); }catch{} }

