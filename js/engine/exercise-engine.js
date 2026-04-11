import state from '../state.js';
import { showScreen } from '../router.js';
import { findExercise } from '../data/exercise-loader.js';
import { renderExercisePlayer, updateTimerDisplay, updateBreathCounter } from '../ui/player.js';
import { showExerciseComplete } from '../ui/modal.js';
import { renderHome } from '../ui/home.js';
import { getAudioContext, resumeAudioContext } from '../audio/audio-context.js';
import { startAmbientDrone, stopAmbient } from '../audio/ambient.js';
import { clearVoiceCache } from '../audio/voice.js';
import { updatePhaseAnimation } from '../animations/animation-factory.js';
import { startCountdown } from './countdown.js';
import { initCurrentPhase, advancePhase } from './phase-manager.js';
import { disposeAll, registerDisposable } from '../utils/cleanup.js';

let animFrameId = null;
let lastTimestamp = null;

function initAudio() {
  const ctx = getAudioContext();
  if (!ctx) return;
  resumeAudioContext();
  if (state.settings.ambient) {
    startAmbientDrone();
  }
}

export function startExercise(exerciseId) {
  const exercise = findExercise(exerciseId);
  if (!exercise) return;

  state.exercise = exercise;
  state.phase = 0;
  state.elapsed = 0;
  state.totalElapsed = 0;
  state.running = false;
  state.paused = false;

  showScreen('exercise');
  renderExercisePlayer();
  initAudio();
}

export function togglePlay() {
  if (!state.exercise) return;

  if (!state.running) {
    resumeAudioContext();
    startCountdown(() => runExercise());
  } else if (!state.paused) {
    state.paused = true;
    document.getElementById('playBtn').textContent = '\u25B6';
  } else {
    state.paused = false;
    document.getElementById('playBtn').textContent = '\u23F8';
  }
}

export function toggleSound() {
  state.settings.ambient = !state.settings.ambient;
  document.getElementById('soundBtn').textContent = state.settings.ambient ? '\uD83D\uDD0A' : '\uD83D\uDD07';
  if (!state.settings.ambient) {
    stopAmbient();
  } else if (state.running) {
    initAudio();
  }
}

export function toggleVoice() {
  state.settings.voice = !state.settings.voice;
  document.getElementById('voiceBtn').textContent = state.settings.voice ? '\uD83C\uDFA4' : '\uD83D\uDD07';
}

function runExercise() {
  if (state.running) return;

  state.running = true;
  state.paused = false;
  state.phase = 0;
  state.elapsed = 0;
  state.totalElapsed = 0;

  document.getElementById('playBtn').textContent = '\u23F8';

  const countdown = document.getElementById('countdown');
  if (countdown && !state.settings.countdown) {
    countdown.style.display = 'none';
  }

  initCurrentPhase();
  lastTimestamp = null;

  animFrameId = requestAnimationFrame(tick);
  registerDisposable(() => {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  });
}

function tick(timestamp) {
  if (!state.running) return;

  if (state.paused) {
    lastTimestamp = null;
    animFrameId = requestAnimationFrame(tick);
    return;
  }

  if (lastTimestamp === null) {
    lastTimestamp = timestamp;
    animFrameId = requestAnimationFrame(tick);
    return;
  }

  const delta = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  state.elapsed += delta;
  state.totalElapsed += delta;

  // Update animation
  const animType = state.exercise.anim || 'circle';
  const phase = state.exercise.phases[state.phase];
  const progress = Math.min(1, state.elapsed / phase.dur);
  updatePhaseAnimation(animType, phase, progress);

  // Check phase completion
  if (state.elapsed >= phase.dur) {
    advancePhase();
  }

  // Check exercise completion
  if (state.totalElapsed >= state.exercise.duration) {
    completeExercise();
    return;
  }

  updateTimerDisplay();
  updateBreathCounter();

  animFrameId = requestAnimationFrame(tick);
}

function completeExercise() {
  const exercise = state.exercise;
  stopExercise();
  showExerciseComplete(exercise, backToHome);

  if (state.settings.sleepMode && exercise.cat !== 'Sport') {
    triggerSleepMode();
  }
}

export function stopExercise() {
  state.running = false;
  state.paused = false;

  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  lastTimestamp = null;

  stopAmbient();
  disposeAll();

  const playBtn = document.getElementById('playBtn');
  if (playBtn) playBtn.textContent = '\u25B6';
}

export function backToHome() {
  stopExercise();
  renderHome();
}

function triggerSleepMode() {
  const overlay = document.getElementById('sleepOverlay');
  if (!overlay) return;

  overlay.classList.add('active');
  const dismiss = () => overlay.classList.remove('active');
  overlay.addEventListener('click', dismiss, { once: true });
  overlay.addEventListener('touchstart', dismiss, { once: true });
}
