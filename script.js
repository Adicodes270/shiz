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
  document.addEventListener('click', playMusic);
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
var iconMenu = document.getElementById('icon-menu');
var iconClose = document.getElementById('icon-close');
navToggle.addEventListener('click', function() {
  var open = mobileMenu.classList.toggle('open');
  iconMenu.style.display = open ? 'none' : 'block';
  iconClose.style.display = open ? 'block' : 'none';
});
document.querySelectorAll('.mobile-menu a').forEach(function(a) {
  a.addEventListener('click', function() {
    mobileMenu.classList.remove('open');
    iconMenu.style.display = 'block';
    iconClose.style.display = 'none';
  });
});
