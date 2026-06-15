const trending = [
  { id: 101, title: "Rift Runner Bundle", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=70", discount: "-28%", price: 42.0, oldPrice: 58.0 },
  { id: 102, title: "Arcade Prism Skin", img: "https://images.unsplash.com/photo-1520975869018-1f4e4b7a2d8b?auto=format&fit=crop&w=900&q=70", discount: "-33%", price: 22.0, oldPrice: 33.0 },
  { id: 103, title: "Neon Tools: FX Pro", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=70", discount: "-31%", price: 18.0, oldPrice: 26.0 },
  { id: 104, title: "Specter Starter Pack", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=70", discount: "-34%", price: 16.0, oldPrice: 24.0 },
  { id: 105, title: "Quantum Royale Set", img: "https://images.unsplash.com/photo-1602526434745-dc0c4b0e3b5d?auto=format&fit=crop&w=900&q=70", discount: "-29%", price: 27.0, oldPrice: 38.0 }
];

function money(n){
  return new Intl.NumberFormat(undefined,{style:"currency",currency:"USD"}).format(n);
}

function carouselCardHTML(p){
  return `
    <div class="carousel-card glass" role="group" aria-label="Trending item ${p.title}">
      <div class="product-media">
        <span class="product-badge">${p.discount}</span>
        <img loading="lazy" decoding="async" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" data-src="${p.img}" alt="${p.title}" />
      </div>
      <div class="product-meta">
        <h3 class="product-title">${p.title}</h3>
        <div class="product-prices">
          <div class="price">${money(p.price)}</div>
          <div class="price--old">${money(p.oldPrice)}</div>
        </div>
        <div class="product-actions">
          <button class="btn btn--secondary magnetic" type="button" data-buy="${p.id}">
            <span class="btn__glow" aria-hidden="true"></span>
            <span>Preview</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function initLazyCarouselImages(){
  const track = document.getElementById('carouselTrack');
  if(!track) return;
  const imgs = track.querySelectorAll('img[data-src]');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const img = e.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '140px' });
  imgs.forEach(img => io.observe(img));
}

function Carousel(){
  this.track = document.getElementById('carouselTrack');
  this.prev = document.getElementById('carouselPrev');
  this.next = document.getElementById('carouselNext');
  this.dots = document.getElementById('carouselDots');
  this.auto = document.getElementById('autoScroll');
  this.index = 0;
  this.timer = null;

  this.render();
  this.attach();
  this.updateLayout();
  this.setDots();
  this.start();
}

Carousel.prototype.render = function(){
  if(!this.track) return;
  this.track.innerHTML = trending.map(carouselCardHTML).join('');
  initLazyCarouselImages();
};

Carousel.prototype.attach = function(){
  if(this.prev) this.prev.addEventListener('click', () => this.go(-1));
  if(this.next) this.next.addEventListener('click', () => this.go(1));
  window.addEventListener('resize', () => this.updateLayout());
  this.auto?.addEventListener('change', () => this.start());
};

Carousel.prototype.updateLayout = function(){
  const cards = this.track?.children;
  if(!cards || cards.length === 0) return;

  // Determine cards per view
  const viewport = this.track.parentElement;
  const cardWidth = cards[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(this.track).gap || '12');
  const stride = cardWidth + gap;

  const perView = Math.max(1, Math.floor((viewport.clientWidth + gap) / stride));
  this.stride = stride;
  this.maxIndex = Math.max(0, cards.length - perView);

  this.goTo(this.index, false);
};

Carousel.prototype.setDots = function(){
  if(!this.dots) return;
  this.dots.innerHTML = '';
  const count = this.maxIndex + 1;
  for(let i=0;i<count;i++){
    const b = document.createElement('button');
    b.className = 'dot-btn';
    b.type = 'button';
    b.setAttribute('aria-label', `Go to slide ${i+1}`);
    b.addEventListener('click', () => this.goTo(i, true));
    this.dots.appendChild(b);
  }
  this.syncDots();
};

Carousel.prototype.syncDots = function(){
  if(!this.dots) return;
  const btns = [...this.dots.querySelectorAll('.dot-btn')];
  btns.forEach((b,i)=> b.classList.toggle('is-active', i===this.index));
};

Carousel.prototype.go = function(delta){
  this.goTo(this.index + delta, true);
};

Carousel.prototype.goTo = function(i, user){
  if(this.maxIndex === undefined) this.updateLayout();
  this.index = Math.max(0, Math.min(this.maxIndex, i));
  this.track.style.transform = `translateX(${-this.index * (this.stride || 332)}px)`;
  this.syncDots();
  if(user) this.start();
};

Carousel.prototype.start = function(){
  if(!this.auto) return;
  const enabled = this.auto.checked;
  if(this.timer) clearInterval(this.timer);
  if(!enabled) return;

  this.timer = setInterval(() => {
    if(this.maxIndex <= 0) return;
    this.go(1);
  }, 3600);
};

// Testimonials slider
const reviews = [
  { id: 1, name: "Astra", img: "https://images.unsplash.com/photo-1520975869018-1f4e4b7a2d8b?auto=format&fit=crop&w=200&q=70", rating: 5, text: "Insane glass UI. The animations feel like a premium product launch. Marketplace filters are fast and clean." },
  { id: 2, name: "Kairo", img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=200&q=70", rating: 4, text: "The glowing buttons + magnetic hover are addictive. Carousel auto-scroll is smooth and looks great on mobile." },
  { id: 3, name: "Mira", img: "https://images.unsplash.com/photo-1593447902536-918d443f3d3c?auto=format&fit=crop&w=200&q=70", rating: 5, text: "Lazy loading keeps the page snappy. Counters and reveals are buttery with ScrollTrigger." }
];

function starsHTML(n){
  return `<div class="stars" aria-label="Rating ${n} out of 5">${Array.from({length:5}).map((_,i)=> i<n ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>').join('')}</div>`;
}

function initTestimonials(){
  const track = document.getElementById('testimonialsTrack');
  const prev = document.getElementById('testPrev');
  const next = document.getElementById('testNext');
  const progress = document.getElementById('testProgress');
  if(!track) return;

  track.innerHTML = reviews.map(r => `
    <div class="review glass" role="group" aria-label="Review by ${r.name}">
      <div class="review__top">
        <div style="display:flex; gap:12px; align-items:center">
          <div class="avatar" aria-hidden="true"><img loading="lazy" decoding="async" src="${r.img}" alt="Avatar ${r.name}"/></div>
          <div>
            <div class="review__name">${r.name}</div>
            ${starsHTML(r.rating)}
          </div>
        </div>
      </div>
      <div class="review__body">“${r.text}”</div>
    </div>
  `).join('');

  let index = 0;
  let timer = null;

  const update = (dir=0) => {
    const cards = track.children;
    if(!cards.length) return;
    const cardW = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap || '12');
    const stride = cardW + gap;
    const viewport = track.parentElement;
    const perView = Math.max(1, Math.floor((viewport.clientWidth + gap)/stride));
    const maxIndex = Math.max(0, cards.length - perView);
    index = Math.max(0, Math.min(maxIndex, index + dir));

    track.style.transform = `translateX(${-index*stride}px)`;

    if(progress){
      const pct = maxIndex === 0 ? 100 : (index / maxIndex) * 100;
      progress.style.width = `${Math.max(8, pct)}%`;
    }
  };

  prev?.addEventListener('click', ()=>{ update(-1); restart();});
  next?.addEventListener('click', ()=>{ update(1); restart();});
  window.addEventListener('resize', ()=> update(0));

  const restart = () => {
    if(timer) clearInterval(timer);
    timer = setInterval(()=> { update(1); }, 4200);
  };

  restart();
};

window.addEventListener('DOMContentLoaded', () => {
  // Trending carousel
  if(!window.__neonforgeCarousel){
    window.__neonforgeCarousel = true;
    new Carousel();
  }
  initTestimonials();
});

