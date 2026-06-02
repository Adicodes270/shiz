window.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bg-music');

  if (bgMusic) {
    const playMusic = () => {
      bgMusic.play()
        .then(() => {
          document.removeEventListener('click', playMusic);
        })
        .catch(() => {
          console.log("Autoplay blocked.");
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


// main.html animations

gsap.from(".profile-card", {
  duration: 1.5,
  marginTop: "100px",
  opacity: 0,
  ease: "power3.out",
  delay: 0.5
});

gsap.from(".profile-badges .badge", {
  duration: 0.8,
  scale: 0.2,
  opacity: 0,
  ease: "back.out(1.5)",
  stagger: 0.5,
  delay: 0.6
});

gsap.from(".profile-title, .profile-subtitle", {
  duration: 1.5,
  y: 50,
  opacity: 0,
  ease: "power2.out",
  delay: 0.8
});

gsap.from(".profile-bio", {
  duration: 1,
  x: -100,
  opacity: 0,
  ease: "power2.out",
  delay: 1.0
});

gsap.from(".inner-card", {
  duration: 2,
  scale: 0.5,
  opacity: 0,
  ease: "power2.out",
  delay: 1.2
});

gsap.from(".profile-avatar", {
  duration: 1.5,
  scale: 0.5,
  opacity: 0,
  ease: "back.out(1.5)",
  delay: 1.4
});

gsap.from(".status-badge", {
  duration: 1.5,
  scale: 0.5,
  opacity: 0,
  ease: "back.out(1.5)",
  delay: 1.4
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

