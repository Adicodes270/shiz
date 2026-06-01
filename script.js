window.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bg-music');

  const playMusic = () => {
    bgMusic.play()
      .then(() => {
        document.removeEventListener('click', playMusic);
      })
      .catch(error => {
        console.log("Autoplay blocked.");
      });
  };

  playMusic();

  document.addEventListener('click', function (e) {
    if (!e.target.closest('nav')) {
      playMusic();
    }
  });

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

var cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', function (e) {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

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

