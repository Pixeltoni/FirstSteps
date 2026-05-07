/* ═══════════════════════════════════════════════
   LOADER
═══════════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
    document.body.classList.remove('loading');
  }, 1600);
});

/* ═══════════════════════════════════════════════
   HERO WORD ANIMATION — apply data-delay as CSS var
═══════════════════════════════════════════════ */
document.querySelectorAll('.hero__word').forEach(el => {
  el.style.setProperty('--delay', el.dataset.delay || 0);
});

/* ═══════════════════════════════════════════════
   SIDEBAR BURGER + NAVIGATION DRAWER
═══════════════════════════════════════════════ */
const sidebarBurger = document.getElementById('sidebarBurger');
const navDrawer     = document.getElementById('navDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose   = document.getElementById('drawerClose');

function openDrawer() {
  navDrawer.classList.add('open');
  drawerOverlay.classList.add('visible');
  sidebarBurger.classList.add('is-open');
  sidebarBurger.setAttribute('aria-label', 'Menü schließen');
}

function closeDrawer() {
  navDrawer.classList.remove('open');
  drawerOverlay.classList.remove('visible');
  sidebarBurger.classList.remove('is-open');
  sidebarBurger.setAttribute('aria-label', 'Menü öffnen');
}

sidebarBurger.addEventListener('click', () =>
  navDrawer.classList.contains('open') ? closeDrawer() : openDrawer()
);
drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

// Close drawer on nav links — but NOT the gallery button
navDrawer.querySelectorAll('.drawer-link:not(.drawer-link--sub)').forEach(link =>
  link.addEventListener('click', closeDrawer)
);

// Escape handling moved to the bottom of this file (handles lb → gallery → drawer)

/* ═══════════════════════════════════════════════
   PARALLAX — hero shapes follow mouse (rAF-throttled)
═══════════════════════════════════════════════ */
const shape1 = document.getElementById('shape1');
const shape2 = document.getElementById('shape2');
const shape3 = document.getElementById('shape3');

let mouseDX = 0, mouseDY = 0, parallaxTicking = false;

document.addEventListener('mousemove', e => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  mouseDX = (e.clientX - cx) / cx;
  mouseDY = (e.clientY - cy) / cy;

  if (!parallaxTicking) {
    requestAnimationFrame(() => {
      shape1.style.transform = `translate3d(${mouseDX * -25}px, ${mouseDY * -20}px, 0)`;
      shape2.style.transform = `translate3d(${mouseDX *  15}px, ${mouseDY *  12}px, 0)`;
      shape3.style.transform = `translate3d(${mouseDX * -10}px, ${mouseDY *  18}px, 0)`;
      parallaxTicking = false;
    });
    parallaxTicking = true;
  }
}, { passive: true });

/* ═══════════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
═══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════════ */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.dataset.target;
    const dur    = 1800;
    const start  = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / dur, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__number').forEach(el => counterObserver.observe(el));

/* ═══════════════════════════════════════════════
   TESTIMONIALS SLIDER
═══════════════════════════════════════════════ */
const track       = document.getElementById('testimonialsTrack');
const dotsWrapper = document.getElementById('testimonialsDots');
const slides      = track.querySelectorAll('.testimonial');
let   currentSlide = 0;

slides.forEach((_, i) => {
  const btn = document.createElement('button');
  btn.setAttribute('aria-label', `Slide ${i + 1}`);
  btn.addEventListener('click', () => goTo(i));
  dotsWrapper.appendChild(btn);
});

function updateDots() {
  dotsWrapper.querySelectorAll('button').forEach((btn, i) => {
    btn.classList.toggle('active', i === currentSlide);
  });
}

function goTo(index) {
  currentSlide = index;
  track.style.transform = `translateX(calc(-${index * 100}% - ${index * 1.5}rem))`;
  updateDots();
}

updateDots();
setInterval(() => goTo((currentSlide + 1) % slides.length), 5000);

let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goTo(diff > 0
    ? Math.min(currentSlide + 1, slides.length - 1)
    : Math.max(currentSlide - 1, 0));
}, { passive: true });

/* ═══════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════ */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn  = e.target.querySelector('.btn');
  const text = btn.querySelector('.btn__text');
  text.textContent = 'Gesendet ✓';
  btn.style.background = 'linear-gradient(135deg,#2d9e5f,#38c172)';
  setTimeout(() => {
    text.textContent = 'Nachricht senden';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

/* ═══════════════════════════════════════════════
   SUNSET SCENE + NAV SCROLL (combined, rAF-throttled)
═══════════════════════════════════════════════ */
const heroContent    = document.querySelector('.hero__content');
const heroScrollHint = document.getElementById('scrollHint');
const sceneSvg       = document.querySelector('.hero__scene-svg');
const nav            = document.getElementById('nav');

const scn = {
  sun:           document.getElementById('sceneSun'),
  glow:          document.getElementById('sceneSunGlowCircle'),
  horizonBand:   document.getElementById('sceneHorizonBand'),
  horizonSpread: document.getElementById('sceneHorizonSpread'),
  cloudL:        document.getElementById('sceneCloudLeft'),
  cloudR:        document.getElementById('sceneCloudRight'),
  reflection:    document.getElementById('sceneReflection'),
  stars:         document.getElementById('sceneStars'),
  moon:          document.getElementById('sceneMoon'),
  nightOverlay:  document.getElementById('sceneNightOverlay')
};

const smoothstep = t => t * t * (3 - 2 * t);

// Cache values that only change on resize
let docScrollable = Math.max(1,
  document.documentElement.scrollHeight - window.innerHeight);

function recalcDocSize() {
  docScrollable = Math.max(1,
    document.documentElement.scrollHeight - window.innerHeight);
}

let lastT = -1, scrollTicking = false;

function applyScroll() {
  const y = window.scrollY;
  const t = Math.min(1, Math.max(0, y / docScrollable));

  // Toggle nav scrolled class (cheap, always do it)
  if (y > 60) nav.classList.add('scrolled');
  else        nav.classList.remove('scrolled');

  // Skip scene work if scroll position barely changed
  if (Math.abs(t - lastT) < 0.0008) {
    scrollTicking = false;
    return;
  }
  lastT = t;

  const sunT   = smoothstep(Math.min(t / 0.5, 1));
  const nightT = smoothstep(Math.max(0, (t - 0.35) / 0.65));
  const moonT  = smoothstep(Math.max(0, (t - 0.5) / 0.5));

  // Hero content fade
  heroContent.style.opacity    = Math.max(0, 1 - y / 500);
  heroContent.style.transform  = `translate3d(0, ${y * 0.15}px, 0)`;
  heroScrollHint.style.opacity = Math.max(0, 1 - y / 200);

  // Sun sinks
  const sunCy = 680 + sunT * 200;
  scn.sun.setAttribute('cy', sunCy);
  scn.glow.setAttribute('cy', sunCy + 10);
  scn.glow.setAttribute('r',  Math.max(0, 320 - sunT * 280));

  // Horizon glow
  const bandPeak = 1 - Math.abs(sunT - 0.6) / 0.6;
  const bandOp   = Math.max(0, Math.min(1, 0.55 + bandPeak * 0.45 - Math.max(0, sunT - 0.7) * 3));
  scn.horizonBand.setAttribute('opacity', bandOp);
  scn.horizonSpread.setAttribute('opacity', Math.max(0, 1 - sunT * 1.15));

  // Clouds fade
  const cloudOpacity = Math.max(0, 1 - sunT * 1.3);
  scn.cloudL.style.opacity = cloudOpacity;
  scn.cloudR.style.opacity = cloudOpacity;

  // Reflection
  const reflPeak = Math.max(0, 1 - Math.abs(sunT - 0.35) / 0.35);
  scn.reflection.setAttribute('opacity', Math.max(0, 0.6 + reflPeak * 0.5 - sunT * 1.2));

  // Stars + moon + night overlay
  scn.stars.setAttribute('opacity', nightT * 0.85);
  scn.moon.setAttribute('opacity', moonT * 0.9);
  scn.moon.setAttribute('transform', `translate(${(1 - moonT) * 120}, ${(1 - moonT) * 60})`);
  scn.nightOverlay.setAttribute('opacity', nightT * 0.62);

  // Whole-scene slow zoom
  sceneSvg.style.transform = `scale(${1 + t * 0.04})`;

  scrollTicking = false;
}

function onScroll() {
  if (!scrollTicking) {
    requestAnimationFrame(applyScroll);
    scrollTicking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => { recalcDocSize(); onScroll(); }, { passive: true });
applyScroll();

/* ═══════════════════════════════════════════════
   PROJECT CARDS — tilt on hover (rAF-throttled per card)
═══════════════════════════════════════════════ */
document.querySelectorAll('.project__image-wrap').forEach(card => {
  let ticking = false, mx = 0, my = 0;

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    mx = (e.clientX - rect.left) / rect.width  - 0.5;
    my = (e.clientY - rect.top)  / rect.height - 0.5;
    if (!ticking) {
      requestAnimationFrame(() => {
        card.style.transform =
          `perspective(800px) rotateY(${mx * 8}deg) rotateX(${my * -6}deg) scale(1.02)`;
        ticking = false;
      });
      ticking = true;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
  });
});

/* ═══════════════════════════════════════════════
   SERVICE CARDS — magnetic hover (rAF-throttled per card)
═══════════════════════════════════════════════ */
document.querySelectorAll('.service-card').forEach(card => {
  let ticking = false, mx = 0, my = 0;

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    mx = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    my = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
    if (!ticking) {
      requestAnimationFrame(() => {
        card.style.transform =
          `translate3d(${mx * 0.3}px, ${-4 + my * 0.3}px, 0)`;
        ticking = false;
      });
      ticking = true;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ═══════════════════════════════════════════════
   GALERIE-UNTERMENÜ
═══════════════════════════════════════════════ */
const galleryPanel  = document.getElementById('galleryPanel');
const openGalleryBtn  = document.getElementById('openGallery');
const closeGalleryBtn = document.getElementById('closeGallery');
const fileInput     = document.getElementById('fileInput');
const dropZone      = document.getElementById('dropZone');
const imgGrid       = document.getElementById('imgGrid');
const galleryBar    = document.getElementById('galleryBar');
const galleryCount  = document.getElementById('galleryCount');
const galleryClear  = document.getElementById('galleryClear');
const lb            = document.getElementById('lb');
const lbImg         = document.getElementById('lbImg');
const lbClose       = document.getElementById('lbClose');

let imgs = [];   // { url, name }

function openGallery() {
  galleryPanel.classList.add('open');
  galleryPanel.setAttribute('aria-hidden', 'false');
}
function closeGallery() {
  galleryPanel.classList.remove('open');
  galleryPanel.setAttribute('aria-hidden', 'true');
}

openGalleryBtn.addEventListener('click', openGallery);
closeGalleryBtn.addEventListener('click', closeGallery);

// ── File handling ─────────────────────────────
function addFiles(files) {
  Array.from(files)
    .filter(f => f.type.startsWith('image/'))
    .forEach(f => imgs.push({ url: URL.createObjectURL(f), name: f.name }));
  renderGrid();
}

function renderGrid() {
  imgGrid.innerHTML = '';
  galleryBar.hidden = imgs.length === 0;
  if (!imgs.length) return;

  galleryCount.textContent = imgs.length === 1 ? '1 Bild' : `${imgs.length} Bilder`;

  imgs.forEach((img, i) => {
    const div = document.createElement('div');
    div.className = 'img-item';
    div.dataset.index = i;
    div.innerHTML = `<img src="${img.url}" alt="${img.name}" loading="lazy">
                     <button class="img-item__rm" aria-label="Entfernen">✕</button>`;
    imgGrid.appendChild(div);
    // entrance animation
    div.style.opacity = '0';
    div.style.transform = 'scale(.88)';
    requestAnimationFrame(() => {
      div.style.transition = `opacity .28s ${i * 0.04}s, transform .28s ${i * 0.04}s`;
      div.style.opacity = '1';
      div.style.transform = 'scale(1)';
    });
  });
}

// Event delegation: remove + lightbox
imgGrid.addEventListener('click', e => {
  const item = e.target.closest('.img-item');
  if (!item) return;
  const i = +item.dataset.index;
  if (e.target.closest('.img-item__rm')) {
    e.stopPropagation();
    URL.revokeObjectURL(imgs[i].url);
    imgs.splice(i, 1);
    renderGrid();
  } else {
    openLb(imgs[i].url, imgs[i].name);
  }
});

galleryClear.addEventListener('click', () => {
  imgs.forEach(img => URL.revokeObjectURL(img.url));
  imgs = [];
  renderGrid();
});

// File input
fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });

// Drag & drop
dropZone.addEventListener('dragover',  e => { e.preventDefault(); dropZone.classList.add('over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('over');
  addFiles(e.dataTransfer.files);
});

// ── Lightbox ──────────────────────────────────
function openLb(url, alt) {
  lbImg.src = url; lbImg.alt = alt;
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
}
function closeLb() {
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  lbImg.src = '';
}

lbClose.addEventListener('click', closeLb);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

// Escape: close lightbox first, then drawer
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (lb.classList.contains('open'))          { closeLb();      return; }
  if (galleryPanel.classList.contains('open')){ closeGallery(); return; }
  closeDrawer();
});
