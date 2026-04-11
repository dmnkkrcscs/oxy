import { svgEl } from '../utils/dom.js';

export function create(container) {
  const svg = svgEl('svg', { width: '200', height: '100', viewBox: '0 0 200 100', class: 'wave-canvas' });
  const path = svgEl('path', { d: 'M 0,50 Q 25,20 50,50 T 100,50 T 150,50 T 200,50' });
  svg.appendChild(path);
  container.appendChild(svg);
}

