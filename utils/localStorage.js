export const saveExerciseState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('exerciseState', serializedState);
  } catch (err) {
    console.error('Could not save state:', err);
  }
};

export const loadExerciseState = () => {
  try {
    const serializedState = localStorage.getItem('exerciseState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state:', err);
    return undefined;
  }
};
