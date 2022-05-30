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
        (status) => this.view.setStatus(status),
        { fireImmediately: true }
      )
    );

    this.clearReactions.push(
      reaction(
        () => this.room.banker.cards,
        (cards) => this.view.bankerCards.setCards(cards),
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
        () => this.room.stop,
        (stop) => this.view.setStop(stop),
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
          this.view.slots.forEach((slot) =>
            winner === slot.config.text && total > 0
              ? slot.setAmount(total)
              : slot.setAmount(0)
          );
        },
        { fireImmediately: true }
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
  };

  constructor(private room: GameRoom, private container: HTMLElement) {
    this.view = new GameApplication(this.container, this.onViewLoad);
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
  }
}
