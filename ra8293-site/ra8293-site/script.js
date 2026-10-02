// Mobile menu
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Accordion for case studies
document.querySelectorAll('.acc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    btn.nextElementSibling.classList.toggle('show');
  });
});

// Scroll spy: highlight current section in nav
const links = [...nav.querySelectorAll('a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach(s => s && spy.observe(s));

// Back to top button
const topBtn = document.getElementById('topBtn');
window.addEventListener('scroll', () => {
  topBtn.style.display = window.scrollY > 400 ? 'block' : 'none';
});
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- Learning features ----
const Q = {
 about:['Which agency was created by RA 8293?',['NBI','IPOPHL','DICT'],1,'IPOPHL (Intellectual Property Office of the Philippines) administers the Code.'],
 ipr:['Which right protects a brand name or logo?',['Trademark','Patent','Copyright'],0,'Trademarks protect brand identifiers such as names and logos.'],
 source:['A salaried developer writes code as part of her regular duties. Who generally owns it?',['The developer','The employer','The client'],1,'Under Sec. 178, employer ownership is the default for work within regular duties, unless a contract says otherwise.'],
 copyright:['Under RA 8293, computer programs are protected as...',['Patents','Trade names','Literary works'],2,'Sec. 172.1 treats computer programs as literary works.'],
 'ai-code':['Why is fully AI-generated code hard to claim under copyright?',['Copyright traditionally needs a human author','AI code is always illegal','It cannot run'],0,'Copyright is tied to human creativity, and the law has no express AI provision yet.'],
 'ai-agreement':['Which is a good rule for using public AI tools at work?',['Paste client data to get better answers','Never paste confidential data or credentials','Skip reviewing the output'],1,'Confidential data should stay out of public tools, and humans must review AI output.'],
 'trade-secret':['A trade secret is lost when...',['It is licensed','It becomes public','It is copyrighted'],1,'Unlike copyright, a trade secret ends once the information is no longer secret.'],
 'fair-use':['Which is NOT one of the four fair use factors?',['Amount used','Effect on the market','Popularity of the author'],2,'The factors are purpose, nature of the work, amount used, and market effect.'],
 agreements:['Which agreement lets someone use IP while the owner keeps ownership?',['Assignment','License','Resignation letter'],1,'A license grants permission to use; an assignment transfers ownership.'],
 plagiarism:['Copying licensed code and crediting the author may still be...',['Copyright infringement','Perfectly legal always','Trademark use'],0,'Credit fixes plagiarism, but you still need permission or a legal exception.'],
 infringement:['Which is an example of software infringement?',['Using an MIT library with its notice','Removing license headers and redistributing','Making one lawful backup copy'],1,'Removing notices and redistributing against the license is infringement.']
};
let answered=0,correct=0;
const scoreEl=document.getElementById('score');
Object.entries(Q).forEach(([id,[q,opts,ans,why]])=>{
  const s=document.getElementById(id); if(!s) return;
  const box=document.createElement('div'); box.className='quiz';
  box.innerHTML='<h4>⚡ Quick Check</h4><p>'+q+'</p>';
  const w=document.createElement('div'); w.className='why'; w.textContent=why;
  opts.forEach((o,i)=>{
    const b=document.createElement('button'); b.className='opt'; b.textContent=o;
    b.onclick=()=>{
      box.querySelectorAll('.opt').forEach((x,j)=>{x.disabled=true; if(j===ans)x.classList.add('right');});
      if(i!==ans) b.classList.add('wrong');
      w.textContent=(i===ans?'✅ Correct! ':'❌ Not quite. ')+why; w.style.display='block';
      answered++; if(i===ans) correct++;
      scoreEl.textContent='Quiz score: '+correct+' / '+answered;
    };
    box.appendChild(b);
  });
  box.appendChild(w); s.appendChild(box);
});
scoreEl.textContent='Quiz score: 0 / 0';

// Previous / Next navigation
sections.forEach((s,i)=>{
  if(!s) return;
  const p=document.createElement('div'); p.className='pager';
  p.innerHTML=(i>0?'<a href="'+links[i-1].getAttribute('href')+'">← '+links[i-1].textContent.replace(' ✓','')+'</a>':'<span></span>')+
    (i<sections.length-1?'<a href="'+links[i+1].getAttribute('href')+'">'+links[i+1].textContent.replace(' ✓','')+' →</a>':'');
  s.appendChild(p);
});

// Reveal on scroll, progress bar, completed marks
const seen=new Set(), bar=document.getElementById('progress');
const reveal=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){
    e.target.classList.add('in');
    if(e.intersectionRatio>0.3 && !seen.has(e.target.id)){
      seen.add(e.target.id);
      const l=nav.querySelector('a[href="#'+e.target.id+'"]'); if(l) l.classList.add('done');
      bar.style.width=(seen.size/sections.length*100)+'%';
    }
  }
}),{threshold:[0.05,0.3]});
sections.forEach(s=>s&&reveal.observe(s));

// Close mobile menu when tapping outside it or pressing Escape
document.addEventListener('click', e => {
  if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== menuBtn) {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') nav.classList.remove('open');
});
