import * as circle from './circle.js';
import * as wave from './wave.js';
import * as particle from './particle.js';
import * as box from './box.js';
import * as nose from './nose.js';
import * as hum from './hum.js';
import * as body from './body.js';
import * as runner from './runner.js';
import * as lotus from './lotus.js';
import { AnimationType } from '../constants.js';

const animModules = {
  [AnimationType.CIRCLE]: circle,
  [AnimationType.WAVE]: wave,
  [AnimationType.PARTICLE]: particle,
  [AnimationType.BOX]: box,
  [AnimationType.NOSE]: nose,
  [AnimationType.HUM]: hum,
  [AnimationType.BODY]: body,
  [AnimationType.RUNNER]: runner,
  [AnimationType.LOTUS]: lotus,
};

export function createAnimation(container, type) {
  const mod = animModules[type] || circle;
  mod.create(container);
}

export function initPhaseAnimation(type, phase) {
  const mod = animModules[type] || circle;
  mod.initPhase(phase);
}

export function updatePhaseAnimation(type, phase, progress) {
  const mod = animModules[type] || circle;
  mod.update(phase, progress);
}
