export const PhaseType = Object.freeze({
  INHALE: 'inhale',
  EXHALE: 'exhale',
  HOLD_TOP: 'hold_top',
  HOLD_BOTTOM: 'hold_bottom',
  PAUSE: 'pause',
  DOUBLE_INHALE: 'double_inhale',
  SIGH: 'sigh',
  NOSTRIL_LEFT: 'nostril_left',
  NOSTRIL_RIGHT: 'nostril_right',
  OBSERVATION: 'observation',
});

export const CATEGORIES = ['Atemübungen', 'Meditation', 'Favoriten'];

export const BREATHING_SUBCATS = [
  'Einschlafen', 'Stressabbau', 'Beruhigung', 'Balance', 'Körper', 'Sport'
];

// Audio constants
export const CHIME_FREQUENCY = 528;
export const CHIME_DURATION = 0.3;
export const AMBIENT_FREQ_LOW = 60;
export const AMBIENT_FREQ_HIGH = 90;
export const AMBIENT_GAIN_LOW = 0.05;
export const AMBIENT_GAIN_HIGH = 0.04;
export const AMBIENT_MASTER_MULTIPLIER = 0.2;
export const VOICE_VOLUME_MULTIPLIER = 1.5;
export const VOICE_CACHE_MAX = 30;

// Timer
export const COUNTDOWN_SECONDS = 3;

// Animation types
export const AnimationType = Object.freeze({
  CIRCLE: 'circle',
  WAVE: 'wave',
  PARTICLE: 'particle',
  BOX: 'box',
  NOSE: 'nose',
  HUM: 'hum',
  BODY: 'body',
  RUNNER: 'runner',
  LOTUS: 'lotus',
});
