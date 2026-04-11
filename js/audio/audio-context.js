let audioContext = null;

export function getAudioContext() {
  if (audioContext) return audioContext;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  audioContext = new AudioCtx();
  return audioContext;
}

export function resumeAudioContext() {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
}
