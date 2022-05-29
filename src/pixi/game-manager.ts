import { BaccaratGameRoom } from 'game/baccarat-game-room';
import { BetWinner } from 'game/model';
import { GameApplication } from './game-application';
import { reaction } from 'mobx';

export class GameManager {
  constructor(private room: BaccaratGameRoom, private view: GameApplication) {
    this.view.manager = this;
    this.view.init();
    reaction(
      () => this.room.status,
      (status) => view.setStatus(status)
    );

    reaction(
      () => this.room.banker.cards,
      (cards) => view.bankerCards.setCards(cards)
    );

    reaction(
      () => this.room.player.cards,
      (cards) => view.playerCards.setCards(cards)
    );

    reaction(
      () => this.room.user.money,
      (money) => view.userStatus.setMoney(money)
    );

    reaction(() => this.room.stop, () => view.setStop(true))

    reaction(
      () => [
        this.room.user.bet.amount,
        this.room.user.bet.winner,
        this.room.currentBet.bet.amount,
      ],
      ([amount, winner, draftAmount]: [number, BetWinner, number]) => {
        const total = amount + draftAmount;
        this.view.userStatus.setBet(amount);
        this.view.slots.forEach((slot) =>
          winner === slot.config.text && total > 0
            ? slot.setActive(total)
            : slot.setActive(0)
        );
      }
    );
  }

  adjustBet(winner: BetWinner): void {
    if (this.room.user.bet.winner !== winner) {
      this.room.user.bet.alterWinner(winner);
    }
    if (this.room.currentBet.bet.winner === winner) {
      this.room.currentBet.increseBet();
    } else {
      this.room.currentBet.bet.alterWinner(winner);
    }
  }

  clearBet(): void {
    this.room.clearBet();
  }

  dealBet(): void {
    this.room.acceptBet(
      this.room.currentBet.bet.amount,
      this.room.currentBet.bet.winner
    );
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
  }
}
