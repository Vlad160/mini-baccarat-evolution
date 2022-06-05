import { BetWinner } from '@game';
import { GameApplication } from './game-application';
import { GameRoom, GameStatus } from 'game/game-room';
import { reaction } from 'mobx';

export class GameManager {
  private view: GameApplication;
  private clearReactions = [];

  private onViewLoad = () => {
    this.view.manager = this;
    this.view.init();

    this.clearReactions.push(
      reaction(
        () => this.room.status,
        (status) => this.setStatus(status),
        { fireImmediately: true }
      )
    );

    this.clearReactions.push(
      reaction(
        () => this.room.banker.cards,
        (cards) => {
          return this.view.bankerCards.setCards(cards);
        },
        { fireImmediately: true }
      )
    );

    this.clearReactions.push(
      reaction(
        () => this.room.player.cards,
        (cards) => this.view.playerCards.setCards(cards),
        { fireImmediately: true }
      )
    );

    this.clearReactions.push(
      reaction(
        () => this.room.user.money,
        (money) => this.view.userStatus.setMoney(money),
        { fireImmediately: true }
      )
    );

    this.clearReactions.push(
      reaction(
        () => [
          this.room.user.bet.amount,
          this.room.user.bet.winner,
          this.room.draftBet.amount,
        ],
        ([amount, winner, draftAmount]: [number, BetWinner, number]) => {
          const total = amount + draftAmount;
          this.view.userStatus.setBet(amount);
          this.view.betAreas.setAmount(total, winner);
        },
        { fireImmediately: true }
      )
    );

    this.clearReactions.push(
      reaction(
        () => this.room.roundResult,
        (result) => {
          this.view.betAreas.setRoundResult(result);
        }
      )
    );

    this.clearReactions.push(
      reaction(
        () => this.room.user.money,
        (money) => {
          this.view.userStatus.setMoney(money);
        },
        { fireImmediately: true }
      )
    );
    this.clearReactions.push(
      reaction(
        () => {
          return this.room.isBettingOpened;
        },
        (isOpened) => {
          isOpened
            ? this.view.userActions.enable()
            : this.view.userActions.disable();
        },
        { fireImmediately: true }
      )
    );

    this.clearReactions.push(
      reaction(
        () => this.room.bettingTimer.timeLeft,
        (timeLeft) => {
          if (this.room.isBettingOpened) {
            this.view.statusPanel.setText(
              `Betting is opened ${Math.round(timeLeft / 1000)} sec`
            );
          }
        }
      )
    );

    this.clearReactions.push(
      reaction(
        () => this.room.roundResult,
        (result) => {
          this.view.roundStatus.show(result);
        }
      )
    );

    this.clearReactions.push(
      reaction(
        () => this.room.user.soundDisabled,
        (disabled) => {
          this.view.soundControl.setMuted(disabled);
        }
      )
    );

    this.onRendered(this.view.app.view);
    this.room.startGame();
  };

  constructor(
    private room: GameRoom,
    private container: HTMLElement,
    private onRendered: (canvas: HTMLCanvasElement) => void
  ) {
    this.view = new GameApplication(
      this.container,
      this.room.user.soundDisabled,
      this.onViewLoad
    );
  }

  adjustBet(winner: BetWinner): void {
    if (this.room.status !== GameStatus.BETTING_OPENED) {
      return;
    }

    if (this.room.user.bet.winner !== winner) {
      this.room.user.bet.alterWinner(winner);
    }
    if (this.room.draftBet.winner === winner) {
      this.room.draftBet.increseBet();
    } else {
      this.room.draftBet.alterWinner(winner);
    }
  }

  clearBet(): void {
    this.room.clearBet();
  }

  dealBet(): void {
    this.room.acceptBet(this.room.draftBet.amount, this.room.draftBet.winner);
  }

  start(): void {
    this.room.startGame();
  }

  stop(): void {
    this.room.stopGame();
  }

  reset(): void {
    this.room.user.money = 1000;
  }

  destroy(): void {
    this.view.app.destroy(true, true);
    this.clearReactions.forEach((cb) => cb());
    this.view.soundManager.destroy();
  }

  setStatus(status: GameStatus): void {
    if (STATUS_TO_MESSAGE[status]) {
      this.view.statusPanel.setText(STATUS_TO_MESSAGE[status](this.room));
    }
  }

  toggleSound(): void {
    this.room.user.soundDisabled = !this.room.user.soundDisabled;
  }
}

const STATUS_TO_MESSAGE = {
  [GameStatus.GAME_NOT_STARTED]: () => 'Game not started',
  [GameStatus.GAME_STARTED]: () => 'Game started',
  [GameStatus.BETTING_CLOSED]: () => 'All bets are made',
  [GameStatus.DEALING_CARDS]: () => 'Dealing cards',
  [GameStatus.GAME_ENDED]: (room: GameRoom) =>
    `Game ended. Winner is ${room.winner}\nWaiting for the next round`,
};
