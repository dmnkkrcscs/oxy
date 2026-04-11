import { getAudioContext } from './audio-context.js';
import { CHIME_FREQUENCY, CHIME_DURATION } from '../constants.js';

export function playChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = CHIME_FREQUENCY;

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + CHIME_DURATION);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };

  osc.start(now);
  osc.stop(now + CHIME_DURATION);
}
