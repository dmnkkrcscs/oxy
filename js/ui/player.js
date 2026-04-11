import state from '../state.js';
import { formatTime } from '../utils/format.js';
import { clearElement } from '../utils/dom.js';
import { createAnimation } from '../animations/animation-factory.js';

export function renderExercisePlayer() {
  if (!state.exercise) return;

  const ex = state.exercise;
  document.getElementById('exTitle').textContent = ex.name;
  document.getElementById('exSubtitle').textContent = ex.cat || '';

  const animContainer = document.getElementById('animContainer');
  clearElement(animContainer);

  createAnimation(animContainer, ex.anim || 'circle');

  updatePhaseDisplay();
  updateTimerDisplay();
}

export function updatePhaseDisplay() {
  if (!state.exercise?.phases) return;
  const phase = state.exercise.phases[state.phase];
  const phaseText = document.getElementById('phaseText');
  const phaseSub = document.getElementById('phaseSub');

  if (phaseText) phaseText.textContent = phase.name.toUpperCase();
  if (phaseSub) phaseSub.textContent = phase.voice || '';
}

export function updateTimerDisplay() {
  const totalDur = state.exercise ? state.exercise.duration : 0;
  const remaining = Math.max(0, totalDur - state.totalElapsed);

  const elapsedEl = document.getElementById('elapsedTime');
  const remainingEl = document.getElementById('remainingTime');

  if (elapsedEl) elapsedEl.textContent = formatTime(state.totalElapsed);
  if (remainingEl) remainingEl.textContent = formatTime(remaining);

  const progressFill = document.getElementById('progressFill');
  if (progressFill && totalDur > 0) {
    progressFill.style.width = (state.totalElapsed / totalDur * 100) + '%';
  }
}

export function updateBreathCounter() {
  const cycleDur = state.exercise.phases.reduce((sum, p) => sum + p.dur, 0);
  const totalCycles = Math.floor(state.totalElapsed / cycleDur);
  const el = document.getElementById('breathCount');
  if (el) el.textContent = totalCycles;
}
