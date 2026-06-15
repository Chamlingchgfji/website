function prefersReducedMotion(){
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Loader removed (was previously defined here).



function initParticles(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  if(prefersReducedMotion()) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  let w=0,h=0, dpr=1;

  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w*dpr);
    canvas.height = Math.floor(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    particles.length = 0;
    const count = Math.floor((w*h)/42000);
    for(let i=0;i<count;i++){
      particles.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: Math.random()*1.4 + 0.6,
        vx: (Math.random()-.5)*0.35,
        vy: (Math.random()-.5)*0.35,
        a: Math.random()*0.6 + 0.25,
        hue: 200 + Math.random()*90
      });
    }
  };

  const linkDist = 120;
  const draw = () => {
    ctx.clearRect(0,0,w,h);

    for(const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x< -20) p.x = w+20;
      if(p.x> w+20) p.x = -20;
      if(p.y< -20) p.y = h+20;
      if(p.y> h+20) p.y = -20;

      ctx.beginPath();
      ctx.fillStyle = `rgba(32,247,255,${p.a})`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    }

    // Links
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist = Math.hypot(dx,dy);
        if(dist < linkDist){
          const t = 1 - dist/linkDist;
          ctx.strokeStyle = `rgba(155,92,255,${t*0.24})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
}

function initScrollReveal(){
  const prefers = prefersReducedMotion();
  const revealEls = [...document.querySelectorAll('.reveal-up')];

  if(prefers){
    revealEls.forEach(el => el.classList.add('reveal-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const el = e.target;
        const delay = Number(el.getAttribute('data-reveal-delay') || 0);
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('reveal-in');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));
}

function initCounters(){
  const els = [...document.querySelectorAll('[data-counter]')];
  if(!els.length) return;

  const prefers = prefersReducedMotion();
  if(prefers){
    els.forEach(el => {
      const val = el.getAttribute('data-counter');
      const suffix = el.getAttribute('data-counter-suffix') || '';
      el.querySelector('.stat__value').textContent = `${val}${suffix}`;
    });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const el = e.target;
      const target = Number(el.getAttribute('data-counter'));
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const format = el.getAttribute('data-counter-format') || 'int';
      const duration = 1400;
      const start = performance.now();
      const valueEl = el.querySelector('.stat__value');

      const step = (now) => {
        const t = Math.min(1, (now-start)/duration);
        const eased = 1 - Math.pow(1-t, 3);
        const cur = target * eased;
        let text;
        if(format === 'float'){
          const dp = target < 10 ? 1 : 0;
          text = cur.toFixed(dp);
        } else {
          text = Math.round(cur).toString();
        }
        valueEl.textContent = `${text}${suffix}`;
        if(t < 1) requestAnimationFrame(step);
        else io.unobserve(el);
      };

      requestAnimationFrame(step);
    });
  }, { threshold: 0.28 });

  els.forEach(el => io.observe(el));
}

function initCursor(){
  const c = document.querySelector('.cursor');
  const t = document.querySelector('.cursor-trail');
  if(!c || !t) return;
  if(prefersReducedMotion()) return;

  let mouseX=0, mouseY=0;
  let trailX=0, trailY=0;

  const onMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    c.style.left = mouseX+'px';
    c.style.top = mouseY+'px';
  };
  window.addEventListener('mousemove', onMove);

  const animate = () => {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    t.style.left = trailX+'px';
    t.style.top = trailY+'px';
    requestAnimationFrame(animate);
  };

  animate();

  // Grow on interactive
  const interactive = () => document.querySelectorAll('button, a, input, [role="button"]');
  const set = () => {
    interactive().forEach(el => {
      el.addEventListener('mouseenter', ()=>{ t.style.transform='translate(-50%,-50%) scale(1.25)'; });
      el.addEventListener('mouseleave', ()=>{ t.style.transform='translate(-50%,-50%) scale(1)'; });
    });
  };
  set();
}

function initMagneticButtons(){
  const btns = [...document.querySelectorAll('.magnetic')];
  const prefers = prefersReducedMotion();
  if(prefers) return;

  btns.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const dx = (mx - r.width/2) / (r.width/2);
      const dy = (my - r.height/2) / (r.height/2);
      el.style.transform = `translate(${dx*4}px, ${dy*4}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

function initAuthModal(){
  const modal = document.getElementById('authModal');
  const open = [...document.querySelectorAll('[data-open="auth"]')];
  const close = modal?.querySelector('.modal__close');
  const note = document.getElementById('authNote');

  if(!modal) return;

  const setOpen = (v) => {
    modal.classList.toggle('is-open', v);
    modal.setAttribute('aria-hidden', String(!v));
  };

  open.forEach(b => b.addEventListener('click', () => setOpen(true)));
  close?.addEventListener('click', () => setOpen(false));
  modal.addEventListener('click', (e)=>{ if(e.target===modal) setOpen(false); });

  const form = document.getElementById('authForm');
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!note) return;
    const email = document.getElementById('accessEmail')?.value?.trim();
    if(!email){ note.textContent='Please enter a valid email.'; return; }
    note.textContent='Access request submitted (demo).';
    setTimeout(()=> setOpen(false), 900);
  });
}

function initNavScroll(){
  const nav = document.querySelector('.nav');
  if(!nav) return;
  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
}

function initHamburger(){
  const btn = document.querySelector('.hamburger');
  const menu = document.getElementById('mobileMenu');
  if(!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.querySelectorAll('span')[0].style.transform = isOpen ? 'translateY(4px) rotate(45deg)' : '';
    btn.querySelectorAll('span')[1].style.opacity = isOpen ? '0' : '';
    btn.querySelectorAll('span')[2].style.transform = isOpen ? 'translateY(-4px) rotate(-45deg)' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
    });
  });
}

function initGSAP(){
  if(!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero floating parallax
  const floats = document.querySelectorAll('.float-card');
  floats.forEach((el, i) => {
    gsap.to(el, {
      y: (i%2===0? -18 : 18),
      ease: 'sine.inOut',
      duration: 2.8 + i*0.2,
      yoyo: true,
      repeat: -1
    });
  });

  // Scroll animations for reveals
  const triggers = [...document.querySelectorAll('.reveal-up')];
  triggers.forEach(el => {
    const delay = Number(el.getAttribute('data-reveal-delay') || 0)/1000;
    gsap.fromTo(el, { opacity:0, y: 18 }, { opacity:1, y:0, duration:0.7, ease:'power3.out', delay, scrollTrigger:{ trigger: el, start:'top 85%', toggleActions:'play none none none' } });
  });

  // Parallax section
  const parBg = document.querySelector('.parallax__bg');
  if(parBg){
    gsap.to(parBg, {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: { trigger: '.section--parallax', start: 'top bottom', end:'bottom top', scrub:true }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollReveal();
  initCounters();
  initCursor();
  initMagneticButtons();
  initAuthModal();
  initNavScroll();
  initHamburger();
  initGSAP();
});

export {}; 



