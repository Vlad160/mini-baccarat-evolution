export enum BetWinner {
  Player = 'Player',
  Banker = 'Banker',
  Tie = 'Tie',
}

export interface IRoundResult {
  earnings: number | null;
  winner: BetWinner;
}
