import { loadFromStorage } from './utils/storage.js';

const state = {
  screen: 'home',
  cat: 'Atemübungen',
  subcat: null,
  exercise: null,
  running: false,
  paused: false,
  phase: 0,
  elapsed: 0,
  totalElapsed: 0,
  settings: {
    voice: true,
    ambient: true,
    chime: true,
    countdown: true,
    volume: 0.5,
    sleepMode: true,
    ambientSound: 'rain',
  },
  favs: loadFromStorage('oxy_favs', []),
};

export default state;
