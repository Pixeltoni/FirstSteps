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
   COUNTER — show final values immediately
═══════════════════════════════════════════════ */
document.querySelectorAll('.stat__number').forEach(el => {
  el.textContent = el.dataset.target;
});

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
   NAV SCROLL
═══════════════════════════════════════════════ */
const nav = document.getElementById('nav');
let scrollTicking = false;

function applyScroll() {
  const y = window.scrollY;
  if (y > 60) nav.classList.add('scrolled');
  else        nav.classList.remove('scrolled');
  scrollTicking = false;
}

function onScroll() {
  if (!scrollTicking) {
    requestAnimationFrame(applyScroll);
    scrollTicking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
applyScroll();

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
