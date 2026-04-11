import { getAudioContext } from './audio-context.js';
import state from '../state.js';
import {
  AMBIENT_FREQ_LOW, AMBIENT_FREQ_HIGH,
  AMBIENT_GAIN_LOW, AMBIENT_GAIN_HIGH,
  AMBIENT_MASTER_MULTIPLIER,
} from '../constants.js';

let oscillators = [];
let gains = [];

export function startAmbientDrone() {
  const ctx = getAudioContext();
  if (!ctx) return;

  stopAmbient();

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  const gain2 = ctx.createGain();
  const masterGain = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'sine';
  osc1.frequency.value = AMBIENT_FREQ_LOW;
  osc2.frequency.value = AMBIENT_FREQ_HIGH;

  gain1.gain.value = AMBIENT_GAIN_LOW;
  gain2.gain.value = AMBIENT_GAIN_HIGH;
  masterGain.gain.value = state.settings.volume * AMBIENT_MASTER_MULTIPLIER;

  osc1.connect(gain1);
  gain1.connect(masterGain);
  osc2.connect(gain2);
  gain2.connect(masterGain);
  masterGain.connect(ctx.destination);

  osc1.start();
  osc2.start();

  oscillators = [osc1, osc2];
  gains = [gain1, gain2, masterGain];
}

export function stopAmbient() {
  for (const osc of oscillators) {
    try { osc.stop(); } catch { /* already stopped */ }
    try { osc.disconnect(); } catch { /* already disconnected */ }
  }
  for (const gain of gains) {
    try { gain.disconnect(); } catch { /* already disconnected */ }
  }
  oscillators = [];
  gains = [];
}
