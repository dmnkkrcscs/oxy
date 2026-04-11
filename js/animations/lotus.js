import { svgEl } from '../utils/dom.js';

export function create(container) {
  const svg = svgEl('svg', { width: '180', height: '180', viewBox: '0 0 180 180', class: 'lotus-anim' });

  const defs = svgEl('defs', {});
  const grad = svgEl('linearGradient', { id: 'lotus-gradient', x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
  const stop1 = svgEl('stop', { offset: '0%', 'stop-color': 'var(--calm)' });
  const stop2 = svgEl('stop', { offset: '100%', 'stop-color': 'var(--accent2)' });
  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  for (let i = 0; i < 3; i++) {
    svg.appendChild(svgEl('circle', { cx: '90', cy: '90', r: '50' }));
  }

  container.appendChild(svg);
}

export function initPhase() {}
export function update() {}
