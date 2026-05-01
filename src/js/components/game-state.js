export function createInitialState() {
  return {
    capital: 150,
    hp: 100,
    reputation: 100,
    role: null,
    items: [],
    unlockedEventIds: [],
    usedEventIds: [],
    currentQuizIndex: 0,
    score: 0,
    flavorText: '',
    armorMacroUsed: false,
    turnCount: 0
  };
}

export let state = createInitialState();

export function resetGameState() {
  state = createInitialState();
  return state;
}

export function updateState(newState) {
  state = { ...state, ...newState };
  return state;
}
