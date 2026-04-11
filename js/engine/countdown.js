import { COUNTDOWN_SECONDS } from '../constants.js';

export function startCountdown(onComplete) {
  let count = COUNTDOWN_SECONDS;
  const el = document.getElementById('countdown');

  if (el) {
    el.style.display = 'flex';
    el.textContent = count;
  }

  const interval = setInterval(() => {
    count--;
    if (el) el.textContent = count;

    if (count <= 0) {
      clearInterval(interval);
      onComplete();
    }
  }, 1000);

  return interval;
}
