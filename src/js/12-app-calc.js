// ---------- aplikacja: kalkulator ----------
function calcEval(src,deg){
  const s=src.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g,'pi').replace(/√/g,'sqrt').replace(/\s+/g,'');
  let i=0; const bad=()=>{ throw new Error('x'); };
  const rad=x=>deg?x*Math.PI/180:x, back=x=>deg?x*180/Math.PI:x;
  const F={sin:x=>Math.sin(rad(x)),cos:x=>Math.cos(rad(x)),tan:x=>Math.tan(rad(x)),asin:x=>back(Math.asin(x)),acos:x=>back(Math.acos(x)),atan:x=>back(Math.atan(x)),ln:Math.log,log:Math.log10,sqrt:Math.sqrt,abs:Math.abs,exp:Math.exp};
  const FK=Object.keys(F).sort((a,b)=>b.length-a.length);
  const fact=n=>{ if(n<0||n!==Math.floor(n)||n>170) bad(); let r=1; for(let k=2;k<=n;k++) r*=k; return r; };
  function expr(){ let v=term(); while(s[i]==='+'||s[i]==='-'){ const o=s[i++], r=term(); v=o==='+'?v+r:v-r; } return v; }
  function term(){ let v=unary(); for(;;){ const c=s[i]||''; if(c==='*'||c==='/'){ i++; const r=unary(); v=c==='*'?v*r:v/r; } else if(c==='('||/[a-z\d.]/.test(c)) v*=unary(); else break; } return v; }
  function unary(){ if(s[i]==='-'){ i++; return -unary(); } if(s[i]==='+'){ i++; return unary(); } return pow(); }
  function pow(){ let b=post(); if(s[i]==='^'){ i++; b=Math.pow(b,unary()); } return b; }
  function post(){ let v=prim(); for(;;){ if(s[i]==='!'){ i++; v=fact(v); } else if(s[i]==='%'){ i++; v=v/100; } else break; } return v; }
  function prim(){
    if(s[i]==='('){ i++; const v=expr(); if(s[i]===')') i++; return v; }
    const m=/^(\d*\.?\d+(?:e[+-]?\d+)?|\d+\.)/i.exec(s.slice(i)); if(m){ i+=m[0].length; return parseFloat(m[0]); }
    const f=/^[a-z]+/.exec(s.slice(i));
    if(f){ const nm=f[0];
      for(const k of FK) if(nm.startsWith(k)){ i+=k.length; if(s[i]!=='(') bad(); i++; const v=expr(); if(s[i]===')') i++; return F[k](v); }
      if(nm.startsWith('pi')){ i+=2; return Math.PI; } if(nm[0]==='e'){ i++; return Math.E; } }
    return bad(); }
  const v=expr(); if(i<s.length) bad(); return v;
}
function mountCalc(el,w){
  const D=(S.aw.data.calc=S.aw.data.calc||{mode:'s',deg:true,hist:[]});
  let expr='', lastEx='', prev='0', just=false, err=false, second=false;
  el.innerHTML=`<div class="calc" tabindex="0"><div class="c-top"><div class="c-seg"><button data-m="s">Prosty</button><button data-m="x">Naukowy</button></div><button class="c-hb" title="Historia">🕘</button></div>
    <div class="c-disp"><div class="c-ex"></div><div class="c-res">0</div></div>
    <div class="c-main"><div class="c-fn"></div><div class="c-pad"></div></div>
    <div class="c-hist"><div class="c-hh"><b>Historia</b><button class="c-hc">Wyczyść historię</button></div><div class="c-hl"></div></div></div>`;
  const root=el.firstElementChild, ex=root.querySelector('.c-ex'), rs=root.querySelector('.c-res'), fn=root.querySelector('.c-fn'), pad=root.querySelector('.c-pad'), hl=root.querySelector('.c-hl');
  const PAD=[['C','C','fx'],['⌫','BS','fx'],['%','%','fx'],['÷','÷','op'],['7','7'],['8','8'],['9','9'],['×','×','op'],['4','4'],['5','5'],['6','6'],['−','−','op'],['1','1'],['2','2'],['3','3'],['+','+','op'],['±','NEG','fx'],['0','0'],['.','.'],['=','EQ','eq']];
  const FNK=()=>[['2nd','2ND','fx'+(second?' on':'')],[D.deg?'DEG':'RAD','DEG','fx'],['(','(','fx'],[')',')','fx'],
    second?['sin⁻¹','asin(','fn']:['sin','sin(','fn'],second?['cos⁻¹','acos(','fn']:['cos','cos(','fn'],second?['tan⁻¹','atan(','fn']:['tan','tan(','fn'],['π','π','fn'],
    ['ln','ln(','fn'],['log','log(','fn'],['e','e','fn'],['n!','!','fn'],['x²','^2','fn'],['√','√(','fn'],['xʸ','^','fn'],['1/x','INV','fn'],
    ['|x|','abs(','fn'],['Ans','ANS','fn'],['eˣ','exp(','fn'],['10ˣ','10^','fn']];
  const btns=l=>l.map(([lab,k,c])=>`<button data-k="${k}" class="${c||''}">${lab}</button>`).join('');
  const fmt=n=>{ if(!isFinite(n)) return null; let v=parseFloat(n.toPrecision(12)); if(v===0) v=0; const a=Math.abs(v);
    return (a!==0&&(a>=1e15||a<1e-9))?v.toExponential(6).replace(/\.?0+e/,'e').replace('e+','e'):String(v); };
  const render=()=>{
    ex.textContent=just?lastEx:expr; let r;
    if(err) r=t('Błąd');
    else if(just) r=expr;
    else if(!expr) r='0';
    else if(/^−?[\d.]+(e[+-]?\d+)?$/i.test(expr)) r=expr;
    else { try{ const f=fmt(calcEval(expr,D.deg)); if(f!==null) prev=f; }catch{} r=prev; }
    rs.textContent=r; rs.classList.toggle('er',err); rs.style.fontSize=(r.length>11?Math.max(16,34-(r.length-11)*1.7):34)+'px';
    root.querySelectorAll('.c-seg button').forEach(b=>b.classList.toggle('on',b.dataset.m===D.mode)); root.classList.toggle('sci',D.mode==='x');
    hl.innerHTML=D.hist.length?D.hist.map((h,i)=>`<div class="he" data-i="${i}"><small>${esc(h.e)} =</small><b>${esc(h.r)}</b></div>`).join(''):'<p class="hint">Brak historii obliczeń.</p>';
  };
  const buildFn=()=>{ fn.innerHTML=btns(FNK()); };
  const OPS=/[+−×÷^]/;
  const press=k=>{
    if(err){ expr=''; err=false; prev='0'; just=false; }
    if(/^[\d.]$/.test(k)){ if(just){ expr=''; just=false; } if(k==='.'&&(expr.split(/[^\d.]/).pop()||'').includes('.')) return render(); expr+=k; }
    else if(k==='C'){ expr=''; just=false; prev='0'; }
    else if(k==='BS'){ if(just){ just=false; } expr=expr.replace(/(?:asin|acos|atan|sin|cos|tan|ln|log|exp|abs|√)\($|[\s\S]$/,''); }
    else if(k==='EQ'){ if(!expr) return; let v; try{ v=calcEval(expr,D.deg); }catch{ v=NaN; } const r=fmt(v);
      if(r===null){ err=true; return render(); }
      D.hist.unshift({e:expr,r}); D.hist=D.hist.slice(0,60); saveSoon(); lastEx=expr+' ='; expr=r; just=true; prev=r; }
    else if(k==='NEG'){ just=false; const m=/^−\((.*)\)$/.exec(expr); expr=!expr?'−':m?m[1]:'−('+expr+')'; }
    else if(k==='INV'){ just=false; expr=expr?'1÷('+expr+')':'1÷('; }
    else if(k==='ANS'){ if(!D.hist[0]) return; if(just) expr=''; just=false; expr+=D.hist[0].r; }
    else if(k==='DEG'){ D.deg=!D.deg; saveSoon(); buildFn(); }
    else if(k==='2ND'){ second=!second; buildFn(); }
    else { const op=/^[+−×÷^!%]$/.test(k);
      if(just&&!op){ expr=''; } just=false;
      if(/^[+×÷^]$/.test(k)&&OPS.test(expr.slice(-1))) expr=expr.slice(0,-1)+k;
      else if(k==='−'&&/[+−]$/.test(expr)) expr=expr.slice(0,-1)+k;
      else expr+=k; }
    render();
  };
  const setMode=m=>{ D.mode=m; saveSoon();
    const r=rectOf(w); if(m==='x') setWinSize(w,Math.max(r.w,600),Math.max(r.h,480)); else if(r.w>380) setWinSize(w,320,r.h); render(); };
  pad.innerHTML=btns(PAD); buildFn();
  root.addEventListener('mousedown',e=>{ if(e.target.closest('button')){ e.preventDefault(); root.focus({preventScroll:true}); } });
  root.addEventListener('click',e=>{
    const b=e.target.closest('button'), he=e.target.closest('.he'); if(!b&&!he) return;
    if(he){ const h=D.hist[+he.dataset.i]; if(!expr||just){ expr=h.r; just=false; } else expr+=h.r; root.classList.remove('h'); render(); return; }
    if(b.dataset.k) press(b.dataset.k); else if(b.dataset.m) setMode(b.dataset.m);
    else if(b.classList.contains('c-hb')) root.classList.toggle('h');
    else if(b.classList.contains('c-hc')){ D.hist=[]; saveSoon(); render(); } });
  root.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.altKey) return;
    const map={'*':'×','/':'÷','-':'−','Enter':'EQ','=':'EQ','Backspace':'BS','Escape':'C','Delete':'C',',':'.','p':'π','P':'π'}, x=map[e.key]??e.key;
    if(/^[0-9.+^()!%]$/.test(x)||['×','÷','−','EQ','BS','C','π'].includes(x)){ e.preventDefault(); press(x); } });
  render();
}
