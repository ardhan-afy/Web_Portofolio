// Navigasi, scroll reveal, dan validasi kontak.
document.getElementById('year').textContent = new Date().getFullYear();
const burgerBtn = document.getElementById('burgerBtn');
const navTabs = document.getElementById('navTabs');
const navbar = document.getElementById('navbar');
const tabs = [...navTabs.querySelectorAll('.tab')];
function setMenu(open) {
  navTabs.classList.toggle('open', open);
  burgerBtn.classList.toggle('open', open);
  navbar.classList.toggle('menu-open', open);
  burgerBtn.setAttribute('aria-expanded', String(open));
  burgerBtn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
}
burgerBtn.addEventListener('click', () => setMenu(!navTabs.classList.contains('open')));
navbar.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', e => { if (!navbar.contains(e.target)) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && navTabs.classList.contains('open')) { setMenu(false); burgerBtn.focus(); } });
matchMedia('(min-width: 901px)').addEventListener('change', () => setMenu(false));
const sections = [...document.querySelectorAll('.hero, main .section')];
let scheduled = false;
function updateNav() {
  navbar.classList.toggle('is-scrolled', scrollY > 16);
  let active = sections[0]?.id;
  for (const section of sections) if (section.getBoundingClientRect().top <= innerHeight * .36) active = section.id;
  if (scrollY > 0 && innerHeight + scrollY >= document.documentElement.scrollHeight - 4) active = sections.at(-1)?.id;
  tabs.forEach(tab => {
    const selected = tab.dataset.tab === active;
    tab.classList.toggle('active', selected);
    if (selected) tab.setAttribute('aria-current', 'location'); else tab.removeAttribute('aria-current');
  });
  scheduled = false;
}
function onScroll() { if (!scheduled) { scheduled = true; requestAnimationFrame(updateNav); } }
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
updateNav();
// ============================================================
// VALIDASI FORM KONTAK (SISI KLIEN)
// ============================================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function setError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  input.closest('.form-group').classList.toggle('error', Boolean(message));
  errorEl.textContent = message || '';
  input.setAttribute('aria-invalid', String(Boolean(message))); 
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.textContent = '';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  let valid = true;

  if (name.length < 3) {
    setError('name', 'nameError', 'Nama minimal 3 karakter');
    valid = false;
  } else {
    setError('name', 'nameError', '');
  }

  if (!isValidEmail(email)) {
    setError('email', 'emailError', 'Format email tidak valid');
    valid = false;
  } else {
    setError('email', 'emailError', '');
  }

  if (message.length < 10) {
    setError('message', 'messageError', 'Pesan minimal 10 karakter');
    valid = false;
  } else {
    setError('message', 'messageError', '');
  }

  if (!valid) { contactForm.querySelector('[aria-invalid="true"]')?.focus(); return; }

  // Portofolio statis: buka draf email, bukan simulasi pesan terkirim.
  const recipient = document.querySelector('a[href^="mailto:"]').getAttribute('href');
  const subject = encodeURIComponent('Pesan portofolio dari ' + name);
  const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\n${message}`);
  formSuccess.textContent = 'Draf email disiapkan — kirim melalui aplikasi email Anda; website ini tidak mengirim pesan secara otomatis';
  window.location.href = `${recipient}?subject=${subject}&body=${body}`;
});

const themeButton=document.getElementById('themeToggle');
function setTheme(theme){document.documentElement.dataset.theme=theme;themeButton.setAttribute('aria-label',theme==='dark'?'Aktifkan tema terang':'Aktifkan tema gelap');themeButton.setAttribute('aria-pressed',String(theme==='light'));document.querySelector('meta[name=theme-color]').content=theme==='dark'?'#111214':'#e5e5e3';try{localStorage.setItem('ardhan-theme',theme)}catch(e){}}
setTheme(document.documentElement.dataset.theme==='light'?'light':'dark');themeButton.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
const projects=[...document.querySelectorAll('.hp-feature')];const workButtons=[...document.querySelectorAll('[data-work]')];
function selectWork(id){projects.forEach(p=>p.hidden=p.id!==id);workButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.work===id)));}
workButtons.forEach(b=>b.addEventListener('click',()=>selectWork(b.dataset.work)));selectWork(projects[0].id);
projects.forEach(root=>{const vp=root.querySelector('.hp-viewport'),phones=[...root.querySelectorAll('.hp-phone')],cap=root.querySelector('.hp-caption'),dots=root.querySelector('.hp-dots');let active=0,start=null;
const markers=phones.map((p,i)=>{const b=document.createElement('button');b.type='button';b.className='hp-dot';b.setAttribute('aria-label',p.dataset.title);b.addEventListener('click',()=>go(i));dots.append(b);p.addEventListener('click',()=>go(i));return b});
function go(i){active=(i+phones.length)%phones.length;const wide=root.classList.contains('is-wide');const gap=wide?(vp.clientWidth<500?95:245):(vp.clientWidth<500?82:168);phones.forEach((p,j)=>{let off=(j-active+phones.length+Math.floor(phones.length/2))%phones.length-Math.floor(phones.length/2);const a=Math.abs(off);p.style.transform=`translate(-50%,-50%) translateX(${off*gap}px) scale(${a?0.82:1})`;p.style.zIndex=String(5-a);p.style.opacity=a>1?'0':a?'0.56':'1';p.style.pointerEvents=a>1?'none':'auto';p.tabIndex=a>1?-1:0;p.setAttribute('aria-hidden',String(a>1));markers[j].classList.toggle('is-on',a===0);markers[j].setAttribute('aria-pressed',String(a===0))});cap.textContent=phones[active].dataset.title;}
root.querySelector('.hp-prev').addEventListener('click',()=>go(active-1));root.querySelector('.hp-next').addEventListener('click',()=>go(active+1));vp.tabIndex=0;vp.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(active+(e.key==='ArrowLeft'?-1:1))}});vp.addEventListener('pointerdown',e=>start=e.clientX);vp.addEventListener('pointerup',e=>{if(start!==null&&Math.abs(e.clientX-start)>45)go(active+(e.clientX<start?1:-1));start=null});vp.addEventListener('pointercancel',()=>start=null);new ResizeObserver(()=>go(active)).observe(vp);go(0);});


