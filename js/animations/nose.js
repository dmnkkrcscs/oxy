import { svgEl } from '../utils/dom.js';

export function create(container) {
  const svg = svgEl('svg', { width: '120', height: '120', viewBox: '0 0 100 100', class: 'nose-anim' });
  for (let i = 0; i < 2; i++) {
    const nostril = svgEl('circle', { cx: String(35 + i * 30), cy: '48', r: '3' });
    svg.appendChild(nostril);
  }
  container.appendChild(svg);
}

export function initPhase() {}
export function update() {}
