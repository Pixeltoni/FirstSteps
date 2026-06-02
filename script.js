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
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

/* ═══════════════════════════════════════════════
   NAV SCROLL
═══════════════════════════════════════════════ */
const nav = document.getElementById('nav');
let scrollTicking = false;

function applyScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) { requestAnimationFrame(applyScroll); scrollTicking = true; }
}, { passive: true });

applyScroll();

/* ═══════════════════════════════════════════════
   WORK MARQUEE — load gallery images from Supabase
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
    const { data: rootEntries, error: rootErr } = await db.storage.from(BUCKET).list('', { limit: 200 });
    if (rootErr) throw rootErr;

    const all = [];
    const folders = (rootEntries || []).filter(e => e && e.name && e.id === null);
    const rootFiles = (rootEntries || [])
      .filter(e => e && e.id && e.name && e.name !== '.emptyFolderPlaceholder')
      .map(e => e.name);

    all.push(...rootFiles);

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
      showMsg('Ladefehler: ' + (e.message || e), true);
      return;
    }

    if (!paths.length) {
      showMsg('Noch keine Bilder hochgeladen.', false);
      return;
    }

    const shuffled = shuffle(paths);
    const seq = shuffled.concat(shuffled);
    const sizeVariants = ['sm', 'md', 'lg', 'xl', 'wide', 'sq', 'xs', 'tall'];
    const posVariants  = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8'];

    track.innerHTML = '';
    seq.forEach((path, i) => {
      const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(path);
      const size = sizeVariants[(i * 5 + 3) % sizeVariants.length];
      const pos  = posVariants[(i * 7 + 1)  % posVariants.length];
      const item = document.createElement('div');
      item.className = `work-marquee__item work-marquee__item--${size} work-marquee__item--${pos}`;
      item.innerHTML = `<img src="${urlData.publicUrl}" alt="" loading="lazy" decoding="async">`;
      track.appendChild(item);
    });
  }

  loadWorkMarquee();
})();
