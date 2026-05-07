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
   CUSTOM CURSOR
═══════════════════════════════════════════════ */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let curX   = 0, curY   = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Smooth lag for the ring cursor
(function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animateCursor);
})();

// Hover effects
const hoverTargets = 'a, button, .service-card, .project__image-wrap, input, textarea, select';

document.addEventListener('mouseover', e => {
  if (e.target.closest(hoverTargets)) cursor.classList.add('hovered');
});
document.addEventListener('mouseout', e => {
  if (e.target.closest(hoverTargets)) cursor.classList.remove('hovered');
});

document.addEventListener('mousedown', () => cursor.classList.add('clicked'));
document.addEventListener('mouseup',   () => cursor.classList.remove('clicked'));

/* ═══════════════════════════════════════════════
   HERO WORD ANIMATION — apply data-delay as CSS var
═══════════════════════════════════════════════ */
document.querySelectorAll('.hero__word').forEach(el => {
  const d = el.dataset.delay || 0;
  el.style.setProperty('--delay', d);
});

/* ═══════════════════════════════════════════════
   NAV — scroll style
═══════════════════════════════════════════════ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
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

navDrawer.querySelectorAll('.drawer-link').forEach(link =>
  link.addEventListener('click', closeDrawer)
);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDrawer();
});

/* ═══════════════════════════════════════════════
   PARALLAX — hero shapes follow mouse
═══════════════════════════════════════════════ */
const shape1 = document.getElementById('shape1');
const shape2 = document.getElementById('shape2');
const shape3 = document.getElementById('shape3');

document.addEventListener('mousemove', e => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  shape1.style.transform = `translate(${dx * -25}px, ${dy * -20}px)`;
  shape2.style.transform = `translate(${dx *  15}px, ${dy *  12}px)`;
  shape3.style.transform = `translate(${dx * -10}px, ${dy *  18}px)`;
});

/* ═══════════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
═══════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal-up');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════════ */
const counters = document.querySelectorAll('.stat__number');

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.dataset.target;
    const dur    = 1800;
    const start  = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / dur, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

/* ═══════════════════════════════════════════════
   TESTIMONIALS SLIDER
═══════════════════════════════════════════════ */
const track       = document.getElementById('testimonialsTrack');
const dotsWrapper = document.getElementById('testimonialsDots');
const slides      = track.querySelectorAll('.testimonial');
let   currentSlide = 0;

// Build dots
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

// Auto-advance
setInterval(() => goTo((currentSlide + 1) % slides.length), 5000);

// Touch/swipe
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goTo(diff > 0
    ? Math.min(currentSlide + 1, slides.length - 1)
    : Math.max(currentSlide - 1, 0));
});

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
   HERO SCROLL FADE + SUNSET SCENE ANIMATION
═══════════════════════════════════════════════ */
const heroContent    = document.querySelector('.hero__content');
const heroScrollHint = document.getElementById('scrollHint');
const heroEl         = document.getElementById('hero');
const sceneSvg       = document.querySelector('.hero__scene-svg');

const scn = {
  sun:        document.getElementById('sceneSun'),
  glow:       document.getElementById('sceneSunGlowCircle'),
  cloudL:     document.getElementById('sceneCloudLeft'),
  cloudR:     document.getElementById('sceneCloudRight'),
  mountains:  document.getElementById('sceneMountains'),
  pier:       document.getElementById('scenePier'),
  reflection: document.getElementById('sceneReflection'),
  stars:      document.getElementById('sceneStars')
};

function updateScene() {
  const y    = window.scrollY;
  const rect = heroEl.getBoundingClientRect();
  const heroH = rect.height || window.innerHeight;
  // Normalised scroll progress through the hero (0 → 1)
  const t = Math.max(0, Math.min(1, -rect.top / heroH));

  /* — UI fade (existing) — */
  heroContent.style.opacity    = Math.max(0, 1 - y / 500);
  heroContent.style.transform  = `translateY(${y * 0.15}px)`;
  heroScrollHint.style.opacity = Math.max(0, 1 - y / 200);

  /* — Scene transforms — */
  // Sun rises (cy moves up)
  scn.sun.setAttribute('cy', 680 - t * 220);
  // Glow follows sun + grows slightly
  scn.glow.setAttribute('cy', 690 - t * 220);
  scn.glow.setAttribute('r',  320 + t * 60);
  // Clouds drift outward
  scn.cloudL.setAttribute('transform', `translate(${-t * 260}, ${-t * 25})`);
  scn.cloudR.setAttribute('transform', `translate(${ t * 260}, ${-t * 25})`);
  // Mountains drift down (camera tilt-up illusion)
  scn.mountains.setAttribute('transform', `translate(0, ${t * 35})`);
  // Pier subtly zooms toward viewer
  scn.pier.setAttribute('transform',
    `translate(0, ${t * 80}) scale(${1 + t * 0.06}, ${1 - t * 0.05})`);
  // Reflection fades and stretches
  scn.reflection.setAttribute('opacity', Math.max(0, 0.6 - t * 0.5));
  // Stars fade in toward "night"
  scn.stars.setAttribute('opacity', t * 0.7);
  // Whole scene gentle zoom + lift
  sceneSvg.style.transform = `scale(${1 + t * 0.08}) translateY(${t * -20}px)`;
}

window.addEventListener('scroll', updateScene, { passive: true });
window.addEventListener('resize', updateScene);
updateScene();

/* ═══════════════════════════════════════════════
   PROJECT CARDS — tilt on hover
═══════════════════════════════════════════════ */
document.querySelectorAll('.project__image-wrap').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${y * -6}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
  });
});

/* ═══════════════════════════════════════════════
   SERVICE CARDS — magnetic hover
═══════════════════════════════════════════════ */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
    card.style.transform = `translateY(-4px) translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
