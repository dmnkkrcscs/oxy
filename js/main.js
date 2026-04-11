import { loadExercises } from './data/exercise-loader.js';
import { loadSettings, saveSettings, handleToggle, openPanel, closePanel } from './ui/settings.js';
import { renderHome, setStartExerciseHandler } from './ui/home.js';
import { closeModal } from './ui/modal.js';
import { startExercise, togglePlay, toggleSound, toggleVoice, backToHome } from './engine/exercise-engine.js';
import state from './state.js';

async function init() {
  try {
    // Lock to portrait if API available (installed PWA)
    if (screen.orientation?.lock) {
      screen.orientation.lock('portrait-primary').catch(() => {});
    }

    await loadExercises();
    loadSettings();

    setStartExerciseHandler(startExercise);
    renderHome();
    setupEventListeners();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  } catch (e) {
    console.error('[oxy] Init error:', e);
  }
}

function setupEventListeners() {
  // Settings panel
  document.getElementById('settingsBtn').addEventListener('click', openPanel);
  document.getElementById('sideBackdrop').addEventListener('click', closePanel);
  document.getElementById('settingsCloseBtn').addEventListener('click', closePanel);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Settings toggles
  document.querySelectorAll('.toggle').forEach(toggle => {
    toggle.addEventListener('click', () => handleToggle(toggle));
  });

  // Volume & ambient sound
  document.getElementById('volumeSlider').addEventListener('change', (e) => {
    state.settings.volume = parseInt(e.target.value) / 100;
    saveSettings();
  });
  document.getElementById('ambientSelect').addEventListener('change', (e) => {
    state.settings.ambientSound = e.target.value;
    saveSettings();
  });

  // Exercise controls
  document.getElementById('soundBtn').addEventListener('click', toggleSound);
  document.getElementById('playBtn').addEventListener('click', togglePlay);
  document.getElementById('voiceBtn').addEventListener('click', toggleVoice);
  document.getElementById('backBtn').addEventListener('click', backToHome);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closePanel();
      if (state.screen === 'exercise') backToHome();
    }
    if (e.key === ' ' && state.screen === 'exercise') {
      e.preventDefault();
      togglePlay();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
