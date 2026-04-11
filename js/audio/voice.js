import state from '../state.js';
import { VOICE_VOLUME_MULTIPLIER, VOICE_CACHE_MAX } from '../constants.js';

const cache = new Map();

export function speak(text) {
  if (!state.settings.voice) return;

  const key = text.replace(/[^a-zA-ZäöüÄÖÜß0-9]/g, '_').substring(0, 40);
  const path = 'audio/' + key + '.mp3';
  const volume = Math.min(1, state.settings.volume * VOICE_VOLUME_MULTIPLIER);

  const cached = cache.get(key);
  if (cached) {
    cached.currentTime = 0;
    cached.volume = volume;
    cached.play().catch(() => {});
    // Move to end (most recently used)
    cache.delete(key);
    cache.set(key, cached);
    return;
  }

  const audio = new Audio(path);
  audio.volume = volume;
  audio.play()
    .then(() => {
      // Evict oldest if cache full
      if (cache.size >= VOICE_CACHE_MAX) {
        const oldestKey = cache.keys().next().value;
        const oldAudio = cache.get(oldestKey);
        if (oldAudio) oldAudio.src = '';
        cache.delete(oldestKey);
      }
      cache.set(key, audio);
    })
    .catch(() => {});
}

export function clearVoiceCache() {
  for (const audio of cache.values()) {
    audio.src = '';
  }
  cache.clear();
}
