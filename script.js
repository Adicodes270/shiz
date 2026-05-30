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

// Optional: Add interactivity (e.g., scale on hover)
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(1.5)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
});   