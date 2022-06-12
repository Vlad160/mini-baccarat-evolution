export enum BetWinner {
  Player = 'Player',
  Banker = 'Banker',
  Tie = 'Tie',
}

export enum UserResultStatus {
  Won = 'Win',
  Lose = 'Lose',
  NotPlayed = 'NotPlayed',
}
export interface IRoundResult {
  earnings: number | null;
  winner: BetWinner;
  userStatus: UserResultStatus;
}

export interface IUserDto {
  money: number;
  name: string;
  id: string;
  soundDisabled: boolean;
}
