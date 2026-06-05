window.addEventListener('DOMContentLoaded', () => {

  // ── ENTRY WIPE REVEAL ──
  // When main.html loads, the purple panel (#entry-wipe) covers the screen.
  // We slide it away upward so the page is revealed smoothly.
  const entryWipe = document.getElementById('entry-wipe');
  if (entryWipe) {
    gsap.to(entryWipe, {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 0.7,
      ease: 'power3.inOut',
      delay: 0.1,
      onComplete: () => {
        entryWipe.style.display = 'none'; // remove from paint tree after done
      }
    });
  }

  // ── MUSIC ──
  const bgMusic = document.getElementById('bg-music');

  if (bgMusic) {
    const savedTime = parseFloat(sessionStorage.getItem('musicTime') || '0');
    const wasMuted = sessionStorage.getItem('musicMuted') === 'true';

    bgMusic.currentTime = savedTime;
    bgMusic.muted = wasMuted;

    setInterval(() => {
      if (!bgMusic.paused) {
        sessionStorage.setItem('musicTime', bgMusic.currentTime);
      }
    }, 1000);

    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('musicTime', bgMusic.currentTime);
      sessionStorage.setItem('musicMuted', bgMusic.muted);
    });

    const playMusic = () => {
      bgMusic.play()
        .then(() => {
          document.removeEventListener('click', playMusic);
        })
        .catch(() => {
          console.log("Autoplay blocked — waiting for click.");
        });
    };

    playMusic();
    document.addEventListener('click', function (e) {
      if (!e.target.closest('nav')) {
        playMusic();
      }
    });
  }

  // ── VIEW COUNTER ──
  var SB_URL = 'https://dmtldpvckorygrprtfeg.supabase.co';
  var SB_KEY = 'sb_publishable_ZgCYBESMNzyJ9uTG52UBIw_kwRLV93k';

  function animateCount(el, target) {
    el.textContent = '0';
    var start = 0;
    var step = target / 90;
    var timer = setInterval(function () {
      start += step;
      if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start);
      }
    }, 10);
  }

  fetch(SB_URL + '/rest/v1/views?select=count&id=eq.1', {
    headers: {
      'apikey': SB_KEY,
      'Authorization': 'Bearer ' + SB_KEY
    }
  })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var current = d[0].count;
      var next = current + 1;

      fetch(SB_URL + '/rest/v1/views?id=eq.1', {
        method: 'PATCH',
        headers: {
          'apikey': SB_KEY,
          'Authorization': 'Bearer ' + SB_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ count: next })
      });

      var el = document.getElementById('view-count');
      if (el) animateCount(el, next);
    })
    .catch(function (err) {
      console.error(err);
      var el = document.getElementById('view-count');
      if (el) el.textContent = '150';
    });

});

// ── PROFILE CARD TILT ──
document.querySelectorAll('.profile-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = y / rect.height * 25;
    const rotateY = -x / rect.width * 25;
    card.style.transform = `perspective(500px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(500px) scale(1) rotateX(0deg) rotateY(0deg)';
  });
});

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

document.querySelectorAll('.mobile-menu a').forEach(function (a) {
  a.addEventListener('click', closeMenu);
});


// ── GSAP PAGE ANIMATIONS ──

gsap.from(".profile-card", {
  duration: 1.5,
  marginTop: "100px",
  opacity: 0,
  ease: "power3.out",
  delay: 0.5
});

gsap.from(".profile-title, .profile-subtitle", {
  duration: 1.5,
  y: 50,
  opacity: 0,
  ease: "power2.out",
  delay: 0.8
});

gsap.from(".profile-avatar", {
  duration: 1.5,
  scale: 0.5,
  opacity: 0,
  ease: "back.out(1.5)",
  delay: 1.4
});

gsap.from(".profile-heading-group", {
  duration: 1.2,
  scale: 0.5,
  opacity: 0,
  ease: "power2.out",
  delay: 0.4
});

gsap.from(".inner-stack-row", {
  duration: 0.8,
  y: 40,
  opacity: 0,
  ease: "power3.out",
  stagger: 0.5,
  delay: 1.0
});

gsap.from("nav", {
  duration: 1,
  y: -100,
  opacity: 0,
  ease: "power2.out",
  delay: 0.3
});

gsap.from(".servers-page-title", {
  duration: 1,
  y: -50,
  opacity: 0,
  ease: "power2.out",
  delay: 0.5
});

gsap.from(".server-card", {
  duration: 1.2,
  scale: 1,
  opacity: 0,
  ease: "power3.out",
  stagger: 0.5,
  delay: 0.3
});

gsap.from(".discord-badges img", {
  duration: 1.2,
  scale: 0,
  opacity: 0,
  ease: "back.out(1.7)",
  stagger: 0.15,
  delay: 0.7
});

gsap.from(".decoration", {
  duration: 1.5,
  scale: 0.5,
  opacity: 0,
  ease: "back.out(1.5)",
  delay: 1.6
});

gsap.from(".onsale-page-title", {
  duration: 1,
  y: -50,
  opacity: 0,
  ease: "power2.out",
  delay: 0.5
});

gsap.from('.onsale-card', {
  duration: 1.2,
  scale: 1,
  opacity: 0,
  ease: "backout(1.7)",
  stagger: 0.5,
  delay: 0.3
});

gsap.from(".events-page-title", {
  duration: 1,
  y: -50,
  opacity: 0,
  ease: "power2.out",
  delay: 0.5
});


// ── LANYARD (DISCORD AVATAR + DECORATION) ──
const DISCORD_USER_ID = "172108151024254976";

async function getLanyardData() {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
    const jsonResult = await response.json();

    if (jsonResult.success) {
      const userData = jsonResult.data;

      const userId = userData.discord_user.id;
      const avatarHash = userData.discord_user.avatar;
      const decorationHash = userData.discord_user.avatar_decoration_data?.asset;

      if (avatarHash) {
        const isAnimated = avatarHash.startsWith("a_");
        const fileExtension = isAnimated ? "gif" : "png";
        const fullAvatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${fileExtension}?size=512`;

        const avatarImageElement = document.querySelector(".profile-avatar");
        const smallAvatarImageElement = document.getElementById("small-avatar");
        const navBrandLogoElement = document.querySelector(".nav-brand-logo");

        if (avatarImageElement) avatarImageElement.src = fullAvatarUrl;
        if (smallAvatarImageElement) smallAvatarImageElement.src = fullAvatarUrl;
        if (navBrandLogoElement) navBrandLogoElement.src = fullAvatarUrl;
      }

      const decorationImageElement = document.querySelector(".decoration");
      if (decorationImageElement) {
        if (decorationHash) {
          const decorationUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${decorationHash}.png?size=240&passthrough=true`;
          decorationImageElement.src = decorationUrl;
          decorationImageElement.style.display = "block";
        } else {
          decorationImageElement.style.display = "none";
        }
      }

      console.log(`Live Status: ${userData.discord_status}`);

    } else {
      console.warn("API was reached but couldn't find user data.");
    }

  } catch (error) {
    console.error("Network error fetching from Lanyard API:", error);
  }
}

getLanyardData();


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

trackAllServers();
setInterval(trackAllServers, 30000);