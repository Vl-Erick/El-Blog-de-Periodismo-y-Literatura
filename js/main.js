(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
document.documentElement.classList.add('js');
const frame=(f,alt,cls)=>`<div class="frame ${cls||''}"><img src="images/${f}" alt="${alt}" loading="lazy" decoding="async" onerror="this.remove()"><div class="ph">${f}<br>(pendiente)</div></div>`;
/* Navegación y progreso */
const hd=$('header.top'),bar=$('#progress'),up=$('#up');let ly=0;
addEventListener('scroll',()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
bar.style.width=(h>0?y/h*100:0)+'%';hd.classList.toggle('hide',y>ly&&y>200);ly=y;up.classList.toggle('show',y>600)},{passive:true});
up.onclick=()=>scrollTo({top:0});
const bg=$('#burger'),ul=$('#menu'),mq=matchMedia('(max-width:900px)');
function menu(open,focus){ul.classList.toggle('open',open);bg.setAttribute('aria-expanded',open);bg.textContent=open?'Cerrar':'Menú';
document.body.classList.toggle('lock',open&&mq.matches);if(open&&focus)$('a',ul).focus();if(!open&&focus)bg.focus()}
bg.onclick=()=>menu(!ul.classList.contains('open'),true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ul.classList.contains('open'))menu(false,true)});
$$('#menu a').forEach(a=>a.addEventListener('click',()=>menu(false,false)));
mq.addEventListener('change',()=>menu(false,false));
const links=$$('#menu a[href^="#"]');
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.setAttribute('aria-current',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>spy.observe(s));
const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>rv.observe(el));
/* Artículos */
const A=window.ARTICLES,grid=$('#cards'),dlg=$('#reader');let cat='Todos',q='';
const cats=['Todos',...new Set(A.map(a=>a.cat))];
$('#chips').innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c==='Todos'}">${c}</button>`).join('');
const strip=h=>h.replace(/<[^>]+>/g,' ').toLowerCase();
function draw(){const l=A.filter(a=>(cat==='Todos'||a.cat===cat)&&(!q||(a.title+a.sum+a.body.join(' ')).toLowerCase().includes(q)||strip(a.body.join(' ')).includes(q)));
grid.innerHTML=l.map(a=>`<article class="card">${frame(a.img,'Ilustración del artículo: '+a.title)}<span class="meta">${a.cat} | ${a.date} | ${a.read} min de lectura</span><h3>${a.title}</h3><p>${a.sum}</p><button class="read" data-id="${a.id}">Leer el artículo completo</button></article>`).join('');
$('#empty').style.display=l.length?'none':'block';$('#count').textContent=l.length+' de '+A.length+' artículos'}
$('#chips').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;cat=b.textContent;$$('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()};
$('#search').oninput=e=>{q=e.target.value.trim().toLowerCase();draw()};
grid.onclick=e=>{const b=e.target.closest('.read');if(!b)return;openArt(b.dataset.id)};
function openArt(id){const a=A.find(x=>x.id===id);if(!a)return;
$('#reader .dlg').innerHTML=`<button class="x" data-close>Cerrar</button><span class="meta">${a.cat} | ${a.date} | ${a.read} min</span><h2>${a.title}</h2><p><strong>${a.sum}</strong></p>${a.body.map(p=>p.startsWith('<h3>')?p.replace(/<\/h3>(.*)/,'</h3><p>$1</p>'):'<p>'+p+'</p>').join('')}<div class="refs"><strong>Fuentes y referencias</strong><ul>${a.refs.map(r=>'<li>'+r+'</li>').join('')}</ul></div>`;
dlg.showModal();history.replaceState(null,'','#'+id)}
document.addEventListener('click',e=>{if(e.target.matches('[data-close]')){e.target.closest('dialog').close()}if(e.target.tagName==='DIALOG')e.target.close()});
dlg.addEventListener('close',()=>history.replaceState(null,'',location.pathname));
document.addEventListener('click',e=>{const l=e.target.closest('[data-open]');if(l){e.preventDefault();openArt(l.dataset.open)}});
draw();
/* Cronologías */
function timeline(el,key){const d=window.TIMELINES[key];
el.innerHTML=`<ol role="tablist" aria-label="Etapas">${d.map((x,i)=>`<li><button role="tab" id="${key}t${i}" aria-selected="${i===0}" aria-controls="${key}p" data-i="${i}"><span class="meta">${x[0]}</span>${x[1]}</button></li>`).join('')}</ol><div class="panel" id="${key}p" role="tabpanel" aria-live="polite"></div>`;
const show=i=>{const x=d[i];const p=$('#'+key+'p',el);p.setAttribute('aria-labelledby',key+'t'+i);p.innerHTML=`<span class="meta">${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p>`;$$('button',el).forEach((b,j)=>b.setAttribute('aria-selected',j===i))};
el.onclick=e=>{const b=e.target.closest('button');if(b)show(+b.dataset.i)};
el.onkeydown=e=>{const bs=$$('button',el),i=bs.findIndex(b=>b.getAttribute('aria-selected')==='true');
if(e.key==='ArrowDown'||e.key==='ArrowRight'){show(Math.min(i+1,bs.length-1));bs[Math.min(i+1,bs.length-1)].focus();e.preventDefault()}
if(e.key==='ArrowUp'||e.key==='ArrowLeft'){show(Math.max(i-1,0));bs[Math.max(i-1,0)].focus();e.preventDefault()}};show(0)}
$$('[data-tl]').forEach(el=>timeline(el,el.dataset.tl));
/* Galería */
const gal=$('#gallery'),lb=$('#lightbox');
gal.innerHTML=window.IMAGES.map((m,i)=>`<button data-i="${i}" aria-label="Ampliar: ${m.alt}">${frame(m.file,m.alt)}</button>`).join('');
let cur=0;
function showImg(i){const n=window.IMAGES.length;cur=(i+n)%n;const m=window.IMAGES[cur];
$('#lightbox .dlg').innerHTML=`<button class="x" data-close>Cerrar</button><h3>${m.alt}</h3>${frame(m.file,m.alt,'wide')}<div class="lbnav"><button class="chip" data-step="-1">Anterior</button><span class="meta">${cur+1} de ${n}</span><button class="chip" data-step="1">Siguiente</button></div>`}
gal.onclick=e=>{const b=e.target.closest('button');if(!b)return;showImg(+b.dataset.i);lb.showModal()};
lb.addEventListener('click',e=>{const s=e.target.closest('[data-step]');if(s)showImg(cur+ +s.dataset.step)});
let tx=null;lb.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',e=>{if(tx===null)return;const d=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(d)>50)showImg(cur+(d<0?1:-1))});
lb.addEventListener('keydown',e=>{if(e.key==='ArrowRight')showImg(cur+1);if(e.key==='ArrowLeft')showImg(cur-1)});
/* Videos */
$$('[data-video]').forEach(el=>{const v=window.VIDEOS[el.dataset.video];if(!v)return;
const media=v.file?`<video controls preload="none" playsinline poster="images/${v.poster}" aria-label="${v.title}"><source src="videos/${v.file}" type="video/mp4">Su navegador no admite video HTML5.</video>`:`<div class="vph">Video pendiente: indique el nombre del archivo en js/articles.js</div>`;
el.innerHTML=`<figure class="video">${media}<figcaption><strong>${v.title}</strong><span class="meta">${v.desc}</span></figcaption></figure>`});
})();
