window.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bg-music');

  const playMusic = () => {
    bgMusic.play()
      .then(() => {
        // Success! Music is playing. 
        // Remove the backup click listener so it doesn't restart on future clicks.
        document.removeEventListener('click', playMusic);
      })
      .catch(error => {
        // Browser blocked autoplay. We wait for a user click instead.
        console.log("Autoplay blocked. Waiting for user interaction to play music.");
      });
  };

  // 1. Try to play immediately on load
  playMusic();

  // 2. Backup: Try to play on the first user click if autoplay was blocked
  document.addEventListener('click', function (e) {
    if (!e.target.closest('nav')) {
      playMusic();
    }
  });

  const counter = new Counter({ workspace: 'shiz' });
  const counterElement = document.querySelector('.view-count');

  counter.up('page-vw')
    .then(result => {
      counterElement.textContent = result.value;
    })
    .catch(error => {
      console.error('Error fetching counter:', error);
      counterElement.textContent = 'N/A';
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
    card.style.transform = 'perspective(500px) scale(1) rotateX(0deg) rotateY(0deg)'
  });
});

const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});


// document.querySelectorAll('a, button').forEach(el => {
//   el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(1.5)');
//   el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
// });   

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
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
mobileOverlay.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-menu a').forEach(function (a) {
  a.addEventListener('click', closeMenu);
});
