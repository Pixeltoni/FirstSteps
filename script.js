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

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

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
   WORK MARQUEE — load gallery images from Supabase, shuffle, scroll right→left
═══════════════════════════════════════════════ */
(function initWorkMarquee() {
  const track = document.getElementById('workTrack');
  if (!track) return;

  function showMsg(text, isError) {
    track.innerHTML = `<p class="work-marquee__empty"${isError ? ' style="color:#e64545"' : ''}>${text}</p>`;
  }

  if (typeof supabase === 'undefined') {
    showMsg('Supabase SDK nicht geladen (CDN blockiert?)', true);
    return;
  }

  const SUPABASE_URL = 'https://rtzvvthcdxklwayhsuha.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0enZ2dGhjZHhrbHdheWhzdWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNzUxMzEsImV4cCI6MjA5Mzc1MTEzMX0.8nGc1tqVq2PL1QK2EArexbXpX01-OK8-9MfLUI4Wnfw';
  const BUCKET = 'galerie';
  const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function listAllImages() {
    // List bucket root
    const { data: rootEntries, error: rootErr } = await db.storage.from(BUCKET).list('', { limit: 200 });
    if (rootErr) throw rootErr;

    const all = [];

    // Folders have id === null, files have an id
    const folders = (rootEntries || []).filter(e => e && e.name && e.id === null);
    const rootFiles = (rootEntries || [])
      .filter(e => e && e.id && e.name && e.name !== '.emptyFolderPlaceholder')
      .map(e => e.name);

    all.push(...rootFiles);

    // Walk into each folder
    for (const folder of folders) {
      const { data: items, error } = await db.storage.from(BUCKET).list(folder.name, { limit: 500 });
      if (error) { console.warn('[work-marquee] folder list fail', folder.name, error); continue; }
      (items || []).forEach(f => {
        if (f.name && f.id && f.name !== '_meta.json' && f.name !== '.emptyFolderPlaceholder') {
          all.push(`${folder.name}/${f.name}`);
        }
      });
    }
    return all;
  }

  async function loadWorkMarquee() {
    let paths;
    try {
      paths = await listAllImages();
    } catch (e) {
      console.error('[work-marquee] supabase error:', e);
      showMsg('Ladefehler: ' + (e.message || e), true);
      return;
    }

    console.log('[work-marquee] paths:', paths);

    if (!paths.length) {
      showMsg('Noch keine Bilder hochgeladen.', false);
      return;
    }

    const shuffled = shuffle(paths);
    const seq = shuffled.concat(shuffled); // duplicate for seamless loop

    const sizeVariants = ['sm', 'md', 'lg', 'xl', 'wide', 'sq'];
    const posVariants  = ['top', 'mid-h', 'mid-l', 'bottom'];

    track.innerHTML = '';
    seq.forEach((path, i) => {
      const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(path);
      const size = sizeVariants[(i * 3 + 1) % sizeVariants.length];
      const pos  = posVariants[(i * 5 + 2)  % posVariants.length];
      const item = document.createElement('div');
      item.className = `work-marquee__item work-marquee__item--${size} work-marquee__item--${pos}`;
      item.innerHTML = `<img src="${urlData.publicUrl}" alt="" loading="lazy" decoding="async">`;
      track.appendChild(item);
    });

    const dur = Math.max(100, Math.min(360, shuffled.length * 14));
    track.style.animationDuration = dur + 's';
    console.log(`[work-marquee] rendered ${shuffled.length} unique images, duration ${dur}s`);
  }

  loadWorkMarquee();
})();
