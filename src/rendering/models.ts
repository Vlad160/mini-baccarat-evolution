import { GameRoom, GameStatus } from '@game';

export interface IPoint {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
  scale: number;
}

export const STATUS_TO_MESSAGE = {
  [GameStatus.GAME_NOT_STARTED]: () => 'Game not started',
  [GameStatus.GAME_STARTED]: () => 'Game started',
  [GameStatus.BETTING_CLOSED]: () => 'All bets are made',
  [GameStatus.DEALING_CARDS]: () => 'Dealing cards',
  [GameStatus.GAME_ENDED]: (room: GameRoom) =>
    `Game ended. Winner is ${room.winner}\nWaiting for the next round`,
};
