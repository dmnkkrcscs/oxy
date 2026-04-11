import { PhaseType } from '../constants.js';

export function create(container) {
  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  canvas.width = 280;
  canvas.height = 280;
  canvas.className = 'particle-canvas';
  container.appendChild(canvas);
}

export function initPhase() {}

export function update(phase, progress) {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const isInhale = phase.type === PhaseType.INHALE ||
                   phase.type === PhaseType.DOUBLE_INHALE ||
                   phase.type === PhaseType.NOSTRIL_LEFT ||
                   phase.type === PhaseType.NOSTRIL_RIGHT;

  const numParticles = 12;
  const maxRadius = isInhale ? 80 * progress : 80 * (1 - progress);

  for (let i = 0; i < numParticles; i++) {
    const angle = (i / numParticles) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * maxRadius;
    const y = centerY + Math.sin(angle) * maxRadius;

    ctx.fillStyle = `rgba(167, 139, 250, ${0.6 - progress * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
