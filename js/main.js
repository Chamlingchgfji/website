function smoothAnchorNavigation(){
  const links = document.querySelectorAll('a[href^="#"]');
  const fade = document.querySelector('.page-fade');

  const setFade = (active) => {
    if(!fade) return;
    fade.classList.toggle('is-active', active);
  };

  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const target = document.querySelector(href);
      if(!target) return;

      e.preventDefault();
      setFade(true);
      setTimeout(() => {
        target.scrollIntoView({ behavior:'smooth', block:'start' });
        history.pushState(null, '', href);
        setFade(false);
      }, 180);
    });
  });
}

function initScrollProgress(){
  const bar = document.querySelector('.scroll-progress span');
  if(!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (scrollTop / max) * 100 : 0;
    bar.style.width = pct.toFixed(2) + '%';
  };

  update();
  window.addEventListener('scroll', update, { passive:true });
}

function initBackToTop(){
  const btn = document.querySelector('.back-to-top');
  if(!btn) return;

  const onScroll = () => {
    btn.style.display = window.scrollY > 600 ? 'block' : 'none';
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  });
}

function initScrolltoButtons(){
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-scrollto]');
    if(!btn) return;
    const sel = btn.getAttribute('data-scrollto');
    const el = document.querySelector(sel);
    if(!el) return;
    el.scrollIntoView({ behavior:'smooth', block:'start' });
  });
}

function initNewsletter(){
  const form = document.getElementById('newsletterForm');
  const note = document.getElementById('newsletterNote');
  if(!form) return;

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('email')?.value?.trim();
    if(!email){
      note.textContent = 'Enter a valid email address.';
      return;
    }
    note.textContent = 'Subscribed! (Demo) Check your inbox soon.';
    form.reset();
  });
}

function initMobileBottomNav(){
  const nav = document.querySelector('.mobile-bottom-nav');
  if(!nav) return;

  const items = [...nav.querySelectorAll('[data-scrollto]')];

  const setActive = (hash) => {
    if(!hash) return;
    const btn = items.find(b => b.getAttribute('data-scrollto') === hash);
    items.forEach(b => b.classList.toggle('is-active', b === btn));
  };

  const sections = items
    .map(b => document.querySelector(b.getAttribute('data-scrollto')))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    // pick the most visible intersecting section
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

    if(!visible.length) return;
    const id = visible[0].target.getAttribute('id');
    if(id) setActive(`#${id}`);
  }, { root: null, threshold: [0.15, 0.25, 0.35, 0.5] });

  sections.forEach(sec => observer.observe(sec));

  // Initial state based on current hash or first section
  if(location.hash) setActive(location.hash);
  else {
    const first = items[0];
    if(first) setActive(first.getAttribute('data-scrollto'));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Init year
  const y = document.getElementById('year');
  if(y) y.textContent = String(new Date().getFullYear());

  smoothAnchorNavigation();
  initScrollProgress();
  initBackToTop();
  initScrolltoButtons();
  initNewsletter();
  initMobileBottomNav();
});

export {};



