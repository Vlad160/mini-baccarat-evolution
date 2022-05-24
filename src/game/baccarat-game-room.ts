import { CasinoActor, CasinoPlayerType } from './casino-actor';
import { action, computed, makeObservable, observable } from 'mobx';

import { BetWinner } from './model';
import { Card } from './card';
import { Deck } from './deck';
import { Timer } from './timer';
import { User } from './player';
import { wait } from './wait';

export enum GameStatus {
  GAME_NOT_STARTED = 'GAME_NOT_STARTED',
  GAME_STARTED = 'GAME_STARTED',
  BETTING_OPENED = 'BETTING_OPENED',
  BETTING_CLOSED = 'BETTING_CLOSED',
  DEALING_CARDS = 'DEALING_CARDS',
  WAITING = 'WAITING',
  FINALIZING_RESULTS = 'FINALIZING_RESULTS',
  GAME_ENDED = 'GAME_ENDED',
}

export class BaccaratGameRoom {
  banker: CasinoActor;
  player: CasinoActor;

  deck: Deck;
  status: GameStatus = GameStatus.GAME_NOT_STARTED;
  history: BetWinner[] = [];
  stop = false;

  readonly bettingTimer = new Timer(10000);
  winner: BetWinner = null;

  constructor(public readonly user: User) {
    this.deck = new Deck();
    this.banker = new CasinoActor(CasinoPlayerType.Banker);
    this.player = new CasinoActor(CasinoPlayerType.Player);

    makeObservable(this, {
      status: observable,
      stop: observable,
      setStatus: action,
      acceptBet: action,
      appendHistory: action,
      setStop: action,
      stopGame: action,
      isGameInProgress: computed,
      isGameStopping: computed,
      isBettingOpened: computed,
      startGame: action,
      history: observable.ref,
    });
  }

  get isBettingOpened(): boolean {
    return this.status === GameStatus.BETTING_OPENED;
  }

  get isGameInProgress(): boolean {
    return (
      this.status !== GameStatus.GAME_NOT_STARTED &&
      this.status !== GameStatus.GAME_ENDED
    );
  }

  acceptBet(amount: number, winner: BetWinner): void {
    if (this.status !== GameStatus.BETTING_OPENED || amount > this.user.money) {
      return;
    }

    const totalBet = this.user.bet.amount;

    if (amount < 0 && amount + totalBet < 0) {
      amount = -totalBet;
    }

    this.user.bet.adjustBet(amount, winner);
    this.user.alterMoney(-amount);
  }

  async startGame(): Promise<BetWinner> {
    if (this.isGameInProgress) {
      return;
    }
    this.setStop(false);
    this.resetRound();
    const result = await this.playRound();
    this.winner = result;
    this.draftMoney(result);
    this.appendHistory(result);
    await wait(5000);
    if (!this.stop) {
      this.startGame();
    }
  }

  stopGame(): void {
    this.setStop(true);
  }

  setStop(stop: boolean): void {
    this.stop = stop;
  }

  setStatus(status: GameStatus): void {
    this.status = status;
  }

  appendHistory(item: BetWinner) {
    this.history = [item, ...this.history];
  }

  get isGameStopping(): boolean {
    return this.isGameInProgress && this.stop;
  }

  private async playRound(): Promise<BetWinner> {
    this.setStatus(GameStatus.GAME_STARTED);
    await wait(2000);
    this.setStatus(GameStatus.BETTING_OPENED);
    await this.bettingTimer.start();
    this.setStatus(GameStatus.BETTING_CLOSED);
    await wait(2000);
    this.setStatus(GameStatus.DEALING_CARDS);
    this.draftCards();
    await wait(2000);
    this.draftThirdCard();
    this.setStatus(GameStatus.FINALIZING_RESULTS);
    await wait(2000);
    const result = this.getRoundResult();
    this.setStatus(GameStatus.GAME_ENDED);
    return result;
  }

  private resetRound(): void {
    this.winner = null;
    this.bettingTimer.stop();
    this.banker.resetCards();
    this.player.resetCards();
    this.user.bet.reset();

    if (this.deck.cards.length < 250) {
      this.deck.resetCards();
    }
  }

  private draftCards(): void {
    this.banker.acceptCards(this.deck.randomCards(2));
    this.player.acceptCards(this.deck.randomCards(2));
  }

  private draftThirdCard(): void {
    if (this.banker.hasNatural || this.player.hasNatural) {
      return;
    }
    const playerScoreBefore = this.player.score;
    const playerRequiresThirdCard = this.player.score <= 5;
    let card: Card = null;
    if (playerRequiresThirdCard) {
      card = this.deck.randomCards(1)[0];
      this.player.acceptCards([card]);
    }
    const bankerScore = this.banker.score;

    if (!card) {
      if (bankerScore <= 5) {
        this.banker.acceptCards(this.deck.randomCards(1));
      }
      return;
    }
    const playerCardValue = this.player.score - playerScoreBefore;
    if (bankerScore === 7) {
      return;
    }
    if (bankerScore === 6 && [6, 7].includes(playerCardValue)) {
      return this.banker.acceptCards(this.deck.randomCards(1));
    }
    if (bankerScore === 5 && [4, 5, 6, 7].includes(playerCardValue)) {
      return this.banker.acceptCards(this.deck.randomCards(1));
    }
    if (bankerScore === 4 && [2, 3, 4, 5, 6, 7].includes(playerCardValue)) {
      return this.banker.acceptCards(this.deck.randomCards(1));
    }
    if (
      bankerScore === 3 &&
      [0, 1, 2, 3, 4, 5, 6, 7, 9].includes(playerCardValue)
    ) {
      return this.banker.acceptCards(this.deck.randomCards(1));
    }
    return this.banker.acceptCards(this.deck.randomCards(1));
  }

  private getRoundResult(): BetWinner {
    if (this.banker.score === this.player.score) {
      return BetWinner.Tie;
    }
    return this.banker.score < this.player.score
      ? BetWinner.Player
      : BetWinner.Banker;
  }

  private draftMoney(result: BetWinner): void {
    const bet = this.user.bet;
    if (bet.winner !== result) {
      return;
    }

    if (result === BetWinner.Player) {
      this.user.alterMoney(bet.amount * 2);
    } else if (result == BetWinner.Banker) {
      this.user.alterMoney(bet.amount * 1.95);
    } else if (result === BetWinner.Tie) {
      this.user.alterMoney(bet.amount * 8);
    } else {
      throw new Error(`Unknown winner result ${bet.winner}`);
    }
  }
}
