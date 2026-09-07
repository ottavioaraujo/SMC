const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a');

document.addEventListener('wheel', (event) => {
  if (event.ctrlKey) event.preventDefault();
}, { passive: false });

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && ['+', '-', '=', '0'].includes(event.key)) event.preventDefault();
});

document.addEventListener('gesturestart', (event) => event.preventDefault());
document.addEventListener('dblclick', (event) => event.preventDefault());

function updateProgress() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  document.documentElement.style.setProperty('--scroll', `${height ? (window.scrollY / height) * 100 : 0}%`);
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach((section) => sectionObserver.observe(section));

const waterLevel = document.querySelector('.water-level');
const waterBars = document.querySelector('.water-bars');

if (waterLevel) {
  const start = Number(waterLevel.dataset.start);
  const target = Number(waterLevel.dataset.target);
  const duration = 9400;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setLevel = (value) => {
    waterLevel.innerHTML = `${value}<sup>%</sup>`;
  };

  const animateWaterLevel = (timestamp) => {
    const initialTime = timestamp;

    const step = (now) => {
      const progress = Math.min((now - initialTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentLevel = start + (target - start) * easedProgress;

      setLevel(Math.round(currentLevel));
      if (waterBars) waterBars.style.setProperty('--water-level', currentLevel / 100);

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (reduceMotion) {
    setLevel(target);
    if (waterBars) waterBars.style.setProperty('--water-level', target / 100);
  } else {
    requestAnimationFrame(animateWaterLevel);
  }
}
