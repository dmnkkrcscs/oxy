let allExercises = [];

export async function loadExercises() {
  const [exercisesResp, meditationsResp] = await Promise.all([
    fetch('data/exercises.json'),
    fetch('data/meditations.json'),
  ]);

  const exercises = await exercisesResp.json();
  const meditations = await meditationsResp.json();

  allExercises = [...exercises, ...meditations];
  return allExercises;
}

export function getExercises() {
  return allExercises;
}

export function findExercise(id) {
  return allExercises.find(ex => ex.id === id) || null;
}
