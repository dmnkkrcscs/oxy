import { svgEl } from '../utils/dom.js';
import { PhaseType } from '../constants.js';

export function create(container) {
  const svg = svgEl('svg', { width: '200', height: '200', viewBox: '0 0 200 200', id: 'boxViz' });
  const path = svgEl('path', {
    d: 'M 50,50 L 150,50 L 150,150 L 50,150 Z',
    stroke: 'var(--accent2)', 'stroke-width': '2', fill: 'none',
  });
  const dot = svgEl('circle', { cx: '50', cy: '50', r: '4', fill: 'var(--accent2)', id: 'boxDot' });

  svg.appendChild(path);
  svg.appendChild(dot);
  container.appendChild(svg);
}

export function initPhase(phase) {
  const dot = document.getElementById('boxDot');
  if (!dot) return;

  if (phase.type === PhaseType.INHALE || phase.type === PhaseType.DOUBLE_INHALE) {
    dot.setAttribute('class', 'box-anim grow');
  } else {
    dot.setAttribute('class', 'box-anim shrink');
  }
}

export function update() {}
