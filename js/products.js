const productsData = [
  { id: 1, title: "Quantum Vandal Skin", category: "skins", price: 19.99, oldPrice: 29.99, discount: "-33%", img: "https://images.unsplash.com/photo-1602526434745-dc0c4b0e3b5d?auto=format&fit=crop&w=900&q=70" },
  { id: 2, title: "Neon Rogue Bundle", category: "bundles", price: 39.0, oldPrice: 59.0, discount: "-34%", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=70" },
  { id: 3, title: "Creator Pack: Audio+FX", category: "tools", price: 24.0, oldPrice: 34.0, discount: "-29%", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=70" },
  { id: 4, title: "Arcade Starter Account", category: "accounts", price: 14.5, oldPrice: 22.0, discount: "-34%", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=70" },
  { id: 5, title: "Cyan Specter Weapon Skin", category: "skins", price: 21.25, oldPrice: 31.5, discount: "-33%", img: "https://images.unsplash.com/photo-1540574163026-643f1a5b36f3?auto=format&fit=crop&w=900&q=70" },
  { id: 6, title: "Tournament Bundle Pro", category: "bundles", price: 49.99, oldPrice: 79.99, discount: "-38%", img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=70" },
  { id: 7, title: "Streaming Overlays Kit", category: "tools", price: 17.0, oldPrice: 24.0, discount: "-29%", img: "https://images.unsplash.com/photo-1593447902536-918d443f3d3c?auto=format&fit=crop&w=900&q=70" },
  { id: 8, title: "Rank Boost Token", category: "accounts", price: 12.75, oldPrice: 18.5, discount: "-31%", img: "https://images.unsplash.com/photo-1511516416462-0c2f6d4a1d1a?auto=format&fit=crop&w=900&q=70" },
  { id: 9, title: "Purple Rift Skin Set", category: "skins", price: 26.5, oldPrice: 39.0, discount: "-32%", img: "https://images.unsplash.com/photo-1520975869018-1f4e4b7a2d8b?auto=format&fit=crop&w=900&q=70" }
];

function money(n){
  return new Intl.NumberFormat(undefined,{style:"currency",currency:"USD"}).format(n);
}

function productCardHTML(p){
  return `
    <article class="product-card glass glow-hover" data-category="${p.category}" data-id="${p.id}">
      <div class="product-media">
        <span class="product-badge">${p.discount}</span>
        <img loading="lazy" decoding="async" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" data-src="${p.img}" alt="${p.title}" />
      </div>
      <div class="product-meta">
        <h3 class="product-title">${p.title}</h3>
        <div class="product-prices" aria-label="Price">
          <div class="price">${money(p.price)}</div>
          <div class="price--old">${money(p.oldPrice)}</div>
        </div>
        <div class="product-actions">
          <button class="btn btn--primary magnetic buy-btn" type="button" data-buy="${p.id}" aria-label="Buy now ${p.title}">
            <span class="btn__glow" aria-hidden="true"></span>
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(category){
  const grid = document.getElementById('productGrid');
  const loader = document.querySelector('.products-loader');
  if(!grid) return;

  const list = (category === 'all') ? productsData : productsData.filter(p => p.category === category);
  grid.innerHTML = '';

  list.forEach(p => grid.insertAdjacentHTML('beforeend', productCardHTML(p)));

  // Lazy image load via IntersectionObserver
  const imgs = grid.querySelectorAll('img[data-src]');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const img = e.target;
        const src = img.getAttribute('data-src');
        img.src = src;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    })
  }, { rootMargin: '120px' });

  imgs.forEach(img => io.observe(img));

  loader.style.display = 'none';
}

function initProductFilters(){
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderProducts(btn.dataset.category);
    });
  });
}

function initBuyNow(){
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-buy]');
    if(!btn) return;

    const id = Number(btn.getAttribute('data-buy'));
    const p = productsData.find(x => x.id === id);

    if(p){
      // Premium-feel feedback (no backend)
      btn.disabled = true;
      btn.style.opacity = '.9';
      btn.querySelector('span:last-child')?.textContent?.includes('Processing');

      const original = btn.innerHTML;
      btn.innerHTML = `<span class="btn__glow" aria-hidden="true"></span><span>Processing…</span>`;

      setTimeout(() => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.innerHTML = original;

        // Use modal if auth not opened
        const note = document.getElementById('authNote');
        const modal = document.getElementById('authModal');
        if(modal){
          modal.classList.add('is-open');
          modal.setAttribute('aria-hidden','false');
        }
        if(note){
          note.textContent = `Added “${p.title}” to your demo cart. (No payment processed.)`;
        }
      }, 900);
    }
  });
}

export function initProducts(){
  const loader = document.querySelector('.products-loader');
  if(loader) loader.style.display = 'flex';

  renderProducts('all');
  initProductFilters();
  initBuyNow();
}

// Auto init (defer script)
window.addEventListener('DOMContentLoaded', () => {
  if(window.matchMedia('(max-width: 0px)').matches) return;
  if(typeof window.__neonforgeInitProducts === 'undefined'){
    window.__neonforgeInitProducts = true;
    initProducts();
  }
});

