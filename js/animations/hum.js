import { svgEl } from '../utils/dom.js';

export function create(container) {
  const svg = svgEl('svg', { width: '180', height: '180', viewBox: '0 0 180 180', class: 'hum-rings' });
  for (let i = 0; i < 3; i++) {
    svg.appendChild(svgEl('circle', { cx: '90', cy: '90', r: '40' }));
  }
  container.appendChild(svg);
}

