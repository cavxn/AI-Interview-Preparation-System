const ringsContainer = document.querySelector('.rings');

for (let i = 1; i <= 50; i++) {
  const ring = document.createElement('div');
  ring.classList.add('ring');
  
  const size = 20 + i * 10; // increasing size
  const speed = 5 + i * 0.5; // increasing speed
  
  ring.style.width = `${size}px`;
  ring.style.height = `${size}px`;
  ring.style.top = `calc(50% - ${size / 2}px)`;
  ring.style.left = `calc(50% - ${size / 2}px)`;
  ring.style.animationDuration = `${speed}s`;
  ring.style.borderColor = `rgba(0, 255, 255, ${0.1 + i / 100})`;

  ringsContainer.appendChild(ring);
}
