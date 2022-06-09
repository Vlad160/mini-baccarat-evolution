export const CONFIG = {
  betSize: 10,
  maxBet: 300,
  betTimer: 10000,
  historyMaxSize: 40,
  beforeGameTimeout: 1000,
  beforeDraftTimeout: 1000,
  beforeThirdCardDraftTimeout: 3000,
  gameTimeout: 4000,
  minDeckSize: 250,
  playerPayMulti: 2,
  bankerPayMulti: 1.95,
  tiePayMulti: 8,
  deckSize: 6,
} as const;

export type GameConfig = typeof CONFIG;
