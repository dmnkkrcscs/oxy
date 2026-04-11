import state from '../state.js';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';

const TOGGLE_MAP = {
  bgMusicToggle: 'ambient',
  ambientToggle: 'ambient',
  phaseSoundsToggle: 'chime',
  voiceGuidanceToggle: 'voice',
  sleepModeToggle: 'sleepMode',
  countdownToggle: 'countdown',
};

export function loadSettings() {
  const saved = loadFromStorage('oxy_settings', null);
  if (saved) {
    state.settings = { ...state.settings, ...saved };
  }
  state.favs = loadFromStorage('oxy_favs', []);
  updateSettingsUI();
}

export function saveSettings() {
  saveToStorage('oxy_settings', state.settings);
  saveToStorage('oxy_favs', state.favs);
}

export function updateSettingsUI() {
  for (const [elementId, settingKey] of Object.entries(TOGGLE_MAP)) {
    const elem = document.getElementById(elementId);
    if (elem) {
      elem.classList.toggle('active', !!state.settings[settingKey]);
    }
  }

  const volumeSlider = document.getElementById('volumeSlider');
  if (volumeSlider) {
    volumeSlider.value = Math.round(state.settings.volume * 100);
  }

  const ambientSelect = document.getElementById('ambientSelect');
  if (ambientSelect) {
    ambientSelect.value = state.settings.ambientSound || 'rain';
  }
}

export function handleToggle(element) {
  element.classList.toggle('active');
  for (const [elementId, settingKey] of Object.entries(TOGGLE_MAP)) {
    if (document.getElementById(elementId) === element) {
      state.settings[settingKey] = element.classList.contains('active');
      break;
    }
  }
  saveSettings();
}

export function openPanel() {
  document.getElementById('settingsPanel').classList.add('active');
  document.getElementById('sideBackdrop').classList.add('active');
}

export function closePanel() {
  document.getElementById('settingsPanel').classList.remove('active');
  document.getElementById('sideBackdrop').classList.remove('active');
}
