window.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bg-music');

  const playMusic = () => {
    bgMusic.play()
      .then(() => {
        document.removeEventListener('click', playMusic);
      })
      .catch(error => {
        console.log("Autoplay blocked. Waiting for user interaction to play music.");
      });
  };

  playMusic();

  document.addEventListener('click', function(e) {
    if (!e.target.closest('nav')) {
      playMusic();
    }
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


const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});


var navToggle = document.getElementById('nav-toggle');
var mobileMenu = document.getElementById('mobile-menu');
var mobileOverlay = document.getElementById('mobile-overlay');
var mobileClose = document.querySelector('.nav-close');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
mobileOverlay.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-menu a').forEach(function(a) {
  a.addEventListener('click', closeMenu);
});


// ── REAL VIEW COUNTER ──
const SUPABASE_URL = 'https://dmtldpvckorygrprtfeg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZgCYBESMNzyJ9uTG52UBIw_kwRLV93k';

async function getAndUpdateViews() {
  try {
    // Get current count
    const res = await fetch(`${SUPABASE_URL}/rest/v1/views?select=count&id=eq.1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    const data = await res.json();
    const currentViews = data[0].count;

    // Increment by 1
    await fetch(`${SUPABASE_URL}/rest/v1/views?id=eq.1`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ count: currentViews + 1 })
    });

    // Animate counter from 0 to current views
    const viewEl = document.getElementById('view-count');
    if (viewEl) {
      let start = 0;
      const target = currentViews + 1;
      const duration = 1500;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          viewEl.textContent = target;
          clearInterval(timer);
        } else {
          viewEl.textContent = Math.floor(start);
        }
      }, 16);
    }
  } catch (err) {
    console.error('View counter error:', err);
    const viewEl = document.getElementById('view-count');
    if (viewEl) viewEl.textContent = '150';
  }
}

getAndUpdateViews();