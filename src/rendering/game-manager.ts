import { BetWinner } from '@game';
import { GameRoom, GameStatus } from '@game/game-room';
import { autorun } from 'mobx';
import { GameApplicationView } from './game-application-view';
import { STATUS_TO_MESSAGE } from './models';

export class GameManager {
  private appView: GameApplicationView;

  private clearReactions = [];

  private onViewLoad = () => {
    this.appView.manager = this;
    this.appView.init();

    this.clearReactions.push(
      autorun(() => {
        this.setStatus(this.room.status);
      })
    );

    this.clearReactions.push(
      autorun(() =>
        this.appView.bankerCards.setCards(
          this.room.banker.cards,
          this.room.banker.score
        )
      )
    );

    this.clearReactions.push(
      autorun(() =>
        this.appView.playerCards.setCards(
          this.room.player.cards,
          this.room.player.score
        )
      )
    );

    this.clearReactions.push(
      autorun(() => this.appView.userStatus.setMoney(this.room.user.money))
    );

    this.clearReactions.push(
      autorun(() => {
        const total = this.room.user.bet.amount;
        this.appView.userStatus.setBet(this.room.user.bet.amount);
        this.appView.betAreas.setAmount(total, this.room.user.bet.winner);
      })
    );

    this.clearReactions.push(
      autorun(() => this.appView.betAreas.setRoundResult(this.room.roundResult))
    );

    this.clearReactions.push(
      autorun(() => this.appView.userStatus.setMoney(this.room.user.money))
    );
    this.clearReactions.push(
      autorun(() => {
        if (this.room.isBettingOpened) {
          this.appView.userActions.enable();
        } else {
          this.appView.userActions.disable();
        }
      })
    );

    this.clearReactions.push(
      autorun(() => {
        if (this.room.isBettingOpened) {
          this.appView.statusPanel.setText(
            `Betting is opened ${Math.round(
              this.room.bettingTimer.timeLeft / 1000
            )} sec`
          );
        }
      })
    );

    this.clearReactions.push(
      autorun(() => this.appView.roundStatus.show(this.room.roundResult))
    );

    this.clearReactions.push(
      autorun(() =>
        this.appView.soundControl.setMuted(this.room.user.soundDisabled)
      )
    );

    this.clearReactions.push(
      autorun(() => this.appView.history.setHistory(this.room.history))
    );

    this.appView.userStatus.setRoomMaxBet(this.room.user.bet.maxBet);

    this.onRendered(this.appView.view);
    this.room.startGame();
  };

  constructor(
    private room: GameRoom,
    private container: HTMLElement,
    private onRendered: (canvas: HTMLCanvasElement) => void
  ) {
    this.appView = new GameApplicationView(
      this.container,
      this.room.user.soundDisabled,
      this.onViewLoad
    );
  }

  acceptBet(winner: BetWinner): void {
    this.room.acceptBet(winner);
  }

  clearBet(): void {
    this.room.clearBet();
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
    this.appView.destroy(true, true);
    this.clearReactions.forEach((cb) => cb());
    this.appView.soundManager.destroy();
  }

  setStatus(status: GameStatus): void {
    if (STATUS_TO_MESSAGE[status]) {
      this.appView.statusPanel.setText(STATUS_TO_MESSAGE[status](this.room));
    }
  }

  toggleSound(): void {
    this.room.user.soundDisabled = !this.room.user.soundDisabled;
  }
}
