import { BetWinner } from '@game';
import { GameRoom, GameStatus } from 'game/game-room';
import { autorun } from 'mobx';
import { GameApplication } from './game-application';
import { STATUS_TO_MESSAGE } from './models';

export class GameManager {
  private view: GameApplication;

  private clearReactions = [];

  private onViewLoad = () => {
    this.view.manager = this;
    this.view.init();

    this.clearReactions.push(
      autorun(() => {
        this.setStatus(this.room.status);
      })
    );

    this.clearReactions.push(
      autorun(() =>
        this.view.bankerCards.setCards(
          this.room.banker.cards,
          this.room.banker.score
        )
      )
    );

    this.clearReactions.push(
      autorun(() =>
        this.view.playerCards.setCards(
          this.room.player.cards,
          this.room.player.score
        )
      )
    );

    this.clearReactions.push(
      autorun(() => this.view.userStatus.setMoney(this.room.user.money))
    );

    this.clearReactions.push(
      autorun(() => {
        const total = this.room.user.bet.amount + this.room.draftBet.amount;
        this.view.userStatus.setBet(this.room.user.bet.amount);
        this.view.betAreas.setAmount(total, this.room.user.bet.winner);
      })
    );

    this.clearReactions.push(
      autorun(() => this.view.betAreas.setRoundResult(this.room.roundResult))
    );

    this.clearReactions.push(
      autorun(() => this.view.userStatus.setMoney(this.room.user.money))
    );
    this.clearReactions.push(
      autorun(() => {
        if (this.room.isBettingOpened) {
          this.view.userActions.enable();
        } else {
          this.view.userActions.disable();
        }
      })
    );

    this.clearReactions.push(
      autorun(() => {
        if (this.room.isBettingOpened) {
          this.view.statusPanel.setText(
            `Betting is opened ${Math.round(
              this.room.bettingTimer.timeLeft / 1000
            )} sec`
          );
        }
      })
    );

    this.clearReactions.push(
      autorun(() => this.view.roundStatus.show(this.room.roundResult))
    );

    this.clearReactions.push(
      autorun(() =>
        this.view.soundControl.setMuted(this.room.user.soundDisabled)
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
      this.room.user.bet.winner = winner;
    }
    if (this.room.draftBet.winner === winner) {
      this.room.draftBet.increseBet();
    } else {
      this.room.draftBet.winner = winner;
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
