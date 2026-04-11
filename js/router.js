import state from './state.js';

export function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(name);
  if (screen) screen.classList.add('active');
  state.screen = name;
}
