import { svgEl } from '../utils/dom.js';

export function create(container) {
  const svg = svgEl('svg', { width: '120', height: '120', viewBox: '0 0 120 120', class: 'runner-anim' });

  const head = svgEl('circle', { cx: '60', cy: '20', r: '8', fill: 'var(--accent2)' });
  const body = svgEl('rect', { x: '55', y: '30', width: '10', height: '30', fill: 'var(--accent2)' });
  const lungFill = svgEl('rect', {
    x: '40', y: '50', width: '40', height: '50',
    fill: 'none', stroke: 'var(--accent2)', 'stroke-width': '2',
    id: 'lungFill', class: 'lung-fill',
  });

  svg.appendChild(head);
  svg.appendChild(body);
  svg.appendChild(lungFill);
  container.appendChild(svg);
}

