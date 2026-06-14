// ══════════════════════════════════════════════════════════════
//  PERSISTENT SETUP — runs once on initial page load only.
//  These are things that live outside the Barba container
//  (music, custom cursor, mobile menu) and must NOT be
//  re-initialised on every transition.
// ══════════════════════════════════════════════════════════════

// ── MUSIC ──


(function() {
  var s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload = function() {
    var container = document.getElementById('particle-bg');
    var SEP = 150, AX = 38, AY = 52;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 355, 1220);

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    var pos = [], col = [];
    for (var ix = 0; ix < AX; ix++) {
      for (var iy = 0; iy < AY; iy++) {
        pos.push(ix * SEP - (AX * SEP) / 2, 0, iy * SEP - (AY * SEP) / 2);
        col.push(0.929, 0.910, 0.890);
      }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));

    var mat = new THREE.PointsMaterial({ size: 7, vertexColors: true, transparent: true, opacity: 0.17, sizeAttenuation: true });
    scene.add(new THREE.Points(geo, mat));

    var count = 0, active = true;

    function animate() {
      if (!active) return;
      requestAnimationFrame(animate);
      var pa = geo.attributes.position.array;
      var i = 0;
      for (var ix = 0; ix < AX; ix++) {
        for (var iy = 0; iy < AY; iy++) {
          pa[i * 3 + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.08;
    }

    document.addEventListener('visibilitychange', function() {
      active = !document.hidden;
      if (active) animate();
    });

    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });

    animate();
  };
  document.head.appendChild(s);
})();



const bgMusic = document.getElementById('bg-music');
if (bgMusic) {
  const savedTime = parseFloat(sessionStorage.getItem('musicTime') || '0');
  const wasMuted = sessionStorage.getItem('musicMuted') === 'true';

  bgMusic.currentTime = savedTime;
  bgMusic.muted = wasMuted;

  setInterval(() => {
    if (!bgMusic.paused) sessionStorage.setItem('musicTime', bgMusic.currentTime);
  }, 1000);

  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('musicTime', bgMusic.currentTime);
    sessionStorage.setItem('musicMuted', bgMusic.muted);
  });

  const playMusic = () => {
    bgMusic.play()
      .then(() => document.removeEventListener('click', playMusic))
      .catch(() => console.log('Autoplay blocked — waiting for click.'));
  };

  playMusic();
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) playMusic();
  });
}

// ── CUSTOM CURSOR ──
var cursor = document.querySelector('.custom-cursor');
if (cursor) {
  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

// ── MOBILE MENU ──
var navToggle = document.getElementById('nav-toggle');
var mobileMenu = document.getElementById('mobile-menu');
var mobileOverlay = document.getElementById('mobile-overlay');
var mobileClose = document.querySelector('.nav-close');

function openMenu() {
  if (mobileMenu) mobileMenu.classList.add('open');
  if (mobileOverlay) mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (mobileOverlay) mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (navToggle) navToggle.addEventListener('click', openMenu);
if (mobileClose) mobileClose.addEventListener('click', closeMenu);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

// ── GSAP NAV ANIMATION (once) ──
gsap.from('nav', { duration: 1, y: -100, opacity: 0, ease: 'power2.out', delay: 0.3 });


// ══════════════════════════════════════════════════════════════
//  PER-PAGE INIT — called after every Barba transition so that
//  page-specific logic (GSAP, Lanyard, server tracker, etc.)
//  is wired up on the fresh container DOM.
// ══════════════════════════════════════════════════════════════

function revealPageElements(namespace) {
  const pageTargets = {
    home: gsap.utils.toArray('.profile-card, .profile-heading-group, .profile-title, .profile-subtitle, .profile-avatar, .inner-stack-row'),
    servers: gsap.utils.toArray('.servers-page-title, .server-card'),
    onsale: gsap.utils.toArray('.onsale-page-title, .onsale-card'),
    events: gsap.utils.toArray('.events-page-title')
  };

  const targets = pageTargets[namespace] || [];
  if (!targets.length) return null;

  gsap.killTweensOf(targets);
  gsap.set(targets, { autoAlpha: 0, visibility: 'hidden' });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (namespace === 'home') {
    tl.fromTo('.profile-card', { autoAlpha: 0, y: 42 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.2)
      .fromTo('.profile-heading-group, .profile-title, .profile-subtitle', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 2 }, 0.5)
      .fromTo('.profile-avatar', { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.9 }, 0.5)
      .fromTo('.inner-stack-row', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.5 }, 1)
      .fromTo('.discord-badges', { autoAlpha: 0, y: 30}, {autoAlpha: 1, y: 0, duration: 1, stagger: 0.5} , 0.5);
  }

  if (namespace === 'servers') {
    tl.fromTo('.servers-page-title', { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.85 }, 0)
      .fromTo('.server-card', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.5 }, 0.15);
  }

  if (namespace === 'onsale') {
    tl.fromTo('.onsale-page-title', { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.85 }, 0)
      .fromTo('.onsale-card', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.5 }, 0.15);
  }

  if (namespace === 'events') {
    tl.fromTo('.events-page-title', { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.85 }, 0);
  }

  return tl;
}

function initPageAnimations(namespace) {
  revealPageElements(namespace);

  // ── VIEW COUNTER (home page only) ──
  if (namespace === 'home') {
    var SB_URL = 'https://dmtldpvckorygrprtfeg.supabase.co';
    var SB_KEY = 'sb_publishable_ZgCYBESMNzyJ9uTG52UBIw_kwRLV93k';

    function animateCount(el, target) {
      el.textContent = '0';
      var start = 0, step = target / 90;
      var timer = setInterval(function () {
        start += step;
        if (start >= target) { el.textContent = target; clearInterval(timer); }
        else { el.textContent = Math.floor(start); }
      }, 10);
    }

    fetch(SB_URL + '/rest/v1/views?select=count&id=eq.1', {
      headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY }
    })
      .then(r => r.json())
      .then(d => {
        var next = d[0].count + 1;
        fetch(SB_URL + '/rest/v1/views?id=eq.1', {
          method: 'PATCH',
          headers: {
            'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY,
            'Content-Type': 'application/json', 'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ count: next })
        });
        var el = document.getElementById('view-count');
        if (el) animateCount(el, next);
      })
      .catch(err => {
        console.error(err);
        var el = document.getElementById('view-count');
        if (el) el.textContent = '150';
      });
  }

  // ── PROFILE CARD TILT ──
  document.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(500px) scale(1.05) rotateX(${y / rect.height * 25}deg) rotateY(${-x / rect.width * 25}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(500px) scale(1) rotateX(0deg) rotateY(0deg)';
    });
  });

  // ── LANYARD ──
  getLanyardData();

  // ── SERVER MEMBER TRACKER ──
  trackAllServers();
}


// ══════════════════════════════════════════════════════════════
//  LANYARD
// ══════════════════════════════════════════════════════════════
const DISCORD_USER_ID = '172108151024254976';

async function getLanyardData() {
  // 1. Instantly inject from Session Storage Cache (Eliminates Alt-text pops entirely)
  const cachedAvatar = sessionStorage.getItem('cachedAvatar');
  const cachedDecoration = sessionStorage.getItem('cachedDecoration');

  const avatarImageElement = document.querySelector(".profile-avatar");
  const smallAvatarImageElement = document.getElementById("small-avatar");
  const navBrandLogoElement = document.querySelector(".nav-brand-logo");
  const decorationImageElement = document.querySelector(".decoration");

  if (cachedAvatar) {
    if (avatarImageElement) avatarImageElement.src = cachedAvatar;
    if (smallAvatarImageElement) smallAvatarImageElement.src = cachedAvatar;
    if (navBrandLogoElement) navBrandLogoElement.src = cachedAvatar;
  }

  if (decorationImageElement) {
    if (cachedDecoration) {
      decorationImageElement.src = cachedDecoration;
      decorationImageElement.style.display = "block";
    } else if (cachedAvatar) {
      decorationImageElement.style.display = "none";
    }
  }

  // 2. Perform background async updates to live state safely
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
    const jsonResult = await response.json();

    if (jsonResult.success) {
      const userData = jsonResult.data;
      const userId = userData.discord_user.id;
      const avatarHash = userData.discord_user.avatar;
      const decorationHash = userData.discord_user.avatar_decoration_data?.asset;

      let freshAvatarUrl = "";
      if (avatarHash) {
        const isAnimated = avatarHash.startsWith("a_");
        const fileExtension = isAnimated ? "gif" : "png";
        freshAvatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${fileExtension}?size=512`;
        
        if (freshAvatarUrl !== cachedAvatar) {
          sessionStorage.setItem('cachedAvatar', freshAvatarUrl);
          if (avatarImageElement) avatarImageElement.src = freshAvatarUrl;
          if (smallAvatarImageElement) smallAvatarImageElement.src = freshAvatarUrl;
          if (navBrandLogoElement) navBrandLogoElement.src = freshAvatarUrl;
        }
      }

      if (decorationImageElement) {
        if (decorationHash) {
          const freshDecorationUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${decorationHash}.png?size=240&passthrough=true`;
          if (freshDecorationUrl !== cachedDecoration) {
            sessionStorage.setItem('cachedDecoration', freshDecorationUrl);
            decorationImageElement.src = freshDecorationUrl;
          }
          decorationImageElement.style.display = "block";
        } else {
          sessionStorage.removeItem('cachedDecoration');
          decorationImageElement.style.display = "none";
        }
      }

      const statusElement = document.getElementById("discord-status");
      if (statusElement) {
        statusElement.className = "status-dot"; 
        if (userData.discord_status === "online") statusElement.classList.add("online");
        else if (userData.discord_status === "dnd") statusElement.classList.add("red");
        else if (userData.discord_status === "idle") statusElement.classList.add("idle");
        else statusElement.classList.add("members");
      }

      const rawStatusText = document.getElementById("discord-status-text");
      if (rawStatusText) {
        let textStatus = userData.discord_status.toUpperCase();
        if (textStatus === "DND") textStatus = "DO NOT DISTURB";
        rawStatusText.textContent = textStatus;
      }
    }
  } catch (error) {
    console.error("Network error updating from Lanyard API:", error);
  }
}

// ── SERVER MEMBER TRACKER ──
async function trackServer(inviteCode) {
  try {
    const card = document.querySelector(`.server-card[data-invite="${inviteCode}"], .inner-stack-row[data-invite="${inviteCode}"]`);
    if (!card) return;

    const res = await fetch(`https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`);
    const data = await res.json();

    const totalMembers = data.approximate_member_count || 0;
    const onlineMembers = data.approximate_presence_count || 0;

    const onlineEl = card.querySelector(".stat-online");
    const totalEl = card.querySelector(".stat-total");

    if (onlineEl) {
      onlineEl.innerHTML = `<span class="status-dot online"></span>Online: ${onlineMembers}`;
    }
    if (totalEl) {
      totalEl.innerHTML = `<span class="status-dot members"></span>Total: ${totalMembers}`;
    }

    console.log(`Server: ${data.guild?.name || inviteCode} Loaded Successfully.`);
  } catch (err) {
    console.error(`Failed to fetch server stats for ${inviteCode}:`, err);
  }
}

function trackAllServers() {
  document.querySelectorAll('[data-invite]').forEach(card => {
    const invite = card.getAttribute('data-invite');
    if (invite) trackServer(invite);
  });
}


// ══════════════════════════════════════════════════════════════
//  BARBA JS — page transition orchestration
//
//  Transition sequence on navigation:
//  1. leave     — instant (no fade-out; wipe will cover everything)
//  2. beforeEnter — #page-wipe sweeps DOWN, covering the screen
//  3. (Barba swaps the container DOM while screen is hidden)
//  4. after     — #page-wipe sweeps UP, revealing the new page
//               — then run page-specific animations
// ══════════════════════════════════════════════════════════════

const pageWipe = document.getElementById('page-wipe');

barba.init({
  sync: false,
  transitions: [
    {
      name: 'page-swipe-transition',
      leave(data) {
        return gsap.fromTo(pageWipe, 
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, duration: 0.4, ease: 'power2.inOut' }
        );
      },
      after(data) {
        const namespace = data.next.namespace;

        document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
          a.classList.remove('active');
          const href = a.getAttribute('href');
          if (href === `${namespace}.html` || (namespace === 'home' && href === 'main.html')) {
            a.classList.add('active');
          }
        });

        document.querySelectorAll('.mobile-menu a').forEach(a => {
          a.addEventListener('click', closeMenu);
        });

        // Instantly start rendering inner text elements and avatars
        initPageAnimations(namespace);

        // Clear the screen overlay immediately in parallel
        gsap.to(pageWipe, {
          scaleY: 0,
          transformOrigin: 'left',
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    }
  ]
});

// ── DYNAMIC FAVICON FROM DISCORD AVATAR ──
async function setDiscordFavicon() {
  try {
    const cached = sessionStorage.getItem('cachedAvatar');
    if (cached) {
      applyFavicon(cached);
      return;
    }
    const res = await fetch(`https://api.lanyard.rest/v1/users/172108151024254976`);
    const json = await res.json();
    if (json.success) {
      const { id, avatar } = json.data.discord_user;
      const ext = avatar.startsWith('a_') ? 'gif' : 'png';
      const url = `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}?size=64`;
      sessionStorage.setItem('cachedAvatar', url);
      applyFavicon(url);
    }
  } catch (e) {
    console.error('Favicon fetch failed:', e);
  }
}

function applyFavicon(url) {
  // Remove all existing favicons
  document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = url.endsWith('.gif') ? 'image/gif' : 'image/png';
  link.href = url;
  document.head.appendChild(link);
}

setDiscordFavicon();


// ── FIRST PAGE LOAD ──
// On the very first load (coming from index.html wipe), the #entry-wipe
// in main.html covers the screen. Reveal it, then run page animations.
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('[data-barba="container"]');
  const namespace = container ? container.dataset.barbaNamespace : '';

  // Handle the entry wipe on main.html first load
  const entryWipe = document.getElementById('entry-wipe');
  if (entryWipe) {
    gsap.to(entryWipe, {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 0.7,
      ease: 'power3.inOut',
      delay: 0.1,
      onComplete: () => {
        entryWipe.style.display = 'none';
        initPageAnimations(namespace);
      }
    });
  } else {
    initPageAnimations(namespace);
  }
});

// Keep refreshing server member counts every 30s regardless of page
setInterval(trackAllServers, 30000);