import { el } from '../utils/dom.js';
import { PhaseType } from '../constants.js';

export function create(container) {
  const circle = el('div', { className: 'circle-anim', id: 'circleViz' });
  container.appendChild(circle);
}

export function initPhase(phase) {
  const circle = document.getElementById('circleViz');
  if (!circle) return;

  circle.className = 'circle-anim';

  switch (phase.type) {
    case PhaseType.INHALE:
    case PhaseType.DOUBLE_INHALE:
    case PhaseType.NOSTRIL_LEFT:
    case PhaseType.NOSTRIL_RIGHT:
      circle.style.setProperty('--inhale-duration', phase.dur + 's');
      circle.classList.add('inhale');
      break;
    case PhaseType.EXHALE:
    case PhaseType.SIGH:
      circle.style.setProperty('--exhale-duration', phase.dur + 's');
      circle.classList.add('exhale');
      break;
    default:
      circle.style.setProperty('--hold-duration', phase.dur + 's');
      circle.classList.add('hold');
  }
}

export function update() {
  // Circle animation is CSS-driven
}
