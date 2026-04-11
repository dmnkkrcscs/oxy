import state from '../state.js';
import { initPhaseAnimation } from '../animations/animation-factory.js';
import { playChime } from '../audio/chime.js';
import { speak } from '../audio/voice.js';
import { updatePhaseDisplay } from '../ui/player.js';

export function initCurrentPhase() {
  const phase = state.exercise.phases[state.phase];
  const animType = state.exercise.anim || 'circle';

  initPhaseAnimation(animType, phase);

  if (state.settings.chime) {
    playChime();
  }

  if (phase.voice && state.settings.voice) {
    speak(phase.voice);
  }

  updatePhaseDisplay();
}

export function advancePhase() {
  state.phase++;
  state.elapsed = 0;

  if (state.phase >= state.exercise.phases.length) {
    state.phase = 0;
  }

  initCurrentPhase();
}
