import { svgEl } from '../utils/dom.js';

export function create(container) {
  const svg = svgEl('svg', { width: '100', height: '200', viewBox: '0 0 100 200', class: 'body-anim' });

  const head = svgEl('circle', {
    cx: '50', cy: '30', r: '20',
    fill: 'none', stroke: 'var(--accent2)', 'stroke-width': '2',
  });

  const body = svgEl('rect', {
    x: '30', y: '55', width: '40', height: '60',
    fill: 'none', stroke: 'var(--accent2)', 'stroke-width': '2',
  });

  svg.appendChild(head);
  svg.appendChild(body);
  container.appendChild(svg);
}

export function initPhase() {}
export function update() {}
