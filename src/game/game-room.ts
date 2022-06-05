import { action, computed, makeObservable, observable } from 'mobx';
import { Bet } from './bet';
import { Card } from './card';
import { CasinoActor, CasinoPlayerType } from './casino-actor';
import { Deck } from './deck';
import { DraftBet } from './draft-bet';
import { BetWinner, UserResultStatus } from './model';
import type { IRoundResult } from './model';
import { Timer } from './timer';
import { User } from './user';
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

export class GameRoom {
  banker: CasinoActor;
  player: CasinoActor;

  deck: Deck;

  @observable
  private _status: GameStatus = GameStatus.GAME_NOT_STARTED;

  @computed
  public get status(): GameStatus {
    return this._status;
  }
  private set status(value: GameStatus) {
    this._status = value;
  }

  @observable.ref
  history: BetWinner[] = [];
  @observable
  stop = false;
  draftBet: DraftBet;

  readonly bettingTimer = new Timer(10000);
  @observable
  private _winner: BetWinner = null;

  @observable.ref
  private _roundResult: IRoundResult = null;
  @computed
  public get roundResult(): IRoundResult {
    return this._roundResult;
  }
  public set roundResult(value: IRoundResult) {
    this._roundResult = value;
  }

  @computed
  public get winner(): BetWinner {
    return this._winner;
  }
  private set winner(value: BetWinner) {
    this._winner = value;
  }

  constructor(public readonly user: User) {
    this.deck = new Deck();
    this.banker = new CasinoActor(CasinoPlayerType.Banker);
    this.player = new CasinoActor(CasinoPlayerType.Player);
    this.draftBet = new DraftBet(this.user, 10);
    makeObservable(this);
  }

  @computed
  get isBettingOpened(): boolean {
    return this.status === GameStatus.BETTING_OPENED;
  }

  @computed
  get isGameInProgress(): boolean {
    return (
      this.status !== GameStatus.GAME_NOT_STARTED &&
      this.status !== GameStatus.GAME_ENDED
    );
  }

  @action
  clearBet(): void {
    if (this.status !== GameStatus.BETTING_OPENED) {
      return;
    }
    this.user.money += this.user.bet.amount;
    this.user.bet.reset();
    this.draftBet.reset();
  }

  @action
  acceptBet(amount: number, winner: BetWinner): void {
    if (this.status !== GameStatus.BETTING_OPENED || amount > this.user.money) {
      return;
    }

    const totalBet = this.user.bet.amount;

    if (amount < 0 && amount + totalBet < 0) {
      amount = -totalBet;
    }

    this.user.bet.adjustBet(amount, winner);
    this.user.money -= amount;
    this.draftBet.reset();
  }

  @action
  async startGame(): Promise<void> {
    if (this.isGameInProgress) {
      return;
    }
    this.setStop(false);
    this.resetRound();
    const result = await this.playRound();
    this.roundResult = result;
    this.winner = result.winner;
    this.user.money += result.earnings;
    this.status = GameStatus.GAME_ENDED;
    this.appendHistory(result.winner);
    await wait(4000);
    if (!this.stop) {
      this.startGame();
    }
  }

  @action
  stopGame(): void {
    this.setStop(true);
  }

  @action
  setStop(stop: boolean): void {
    this.stop = stop;
  }

  @action
  appendHistory(item: BetWinner) {
    this.history = [item, ...this.history];
  }

  @computed
  get isGameStopping(): boolean {
    return this.isGameInProgress && this.stop;
  }

  @action
  private async playRound(): Promise<IRoundResult> {
    this.status = GameStatus.GAME_STARTED;
    await wait(1000);
    this.status = GameStatus.BETTING_OPENED;
    await this.bettingTimer.start();
    this.status = GameStatus.BETTING_CLOSED;
    this.draftBet.reset();
    await wait(1000);
    this.status = GameStatus.DEALING_CARDS;
    this.draftCards();
    await wait(3000);
    this.draftThirdCard();
    this.status = GameStatus.FINALIZING_RESULTS;
    const result = this.getRoundResult();
    return result;
  }

  @action
  private resetRound(): void {
    this.winner = null;
    this.bettingTimer.stop();
    this.banker.resetCards();
    this.player.resetCards();
    this.user.bet.reset();
    this.draftBet.reset();

    if (this.deck.cards.length < 250) {
      this.deck.resetCards();
    }
  }

  @action
  private draftCards(): void {
    this.banker.acceptCards(this.deck.take(2));
    this.player.acceptCards(this.deck.take(2));
  }

  @action
  private draftThirdCard(): void {
    if (this.banker.hasNatural || this.player.hasNatural) {
      return;
    }
    const playerScoreBefore = this.player.score;
    const playerRequiresThirdCard = this.player.score <= 5;
    let card: Card = null;
    if (playerRequiresThirdCard) {
      card = this.deck.take(1)[0];
      this.player.acceptCards([card]);
    }
    const bankerScore = this.banker.score;

    if (!card) {
      if (bankerScore <= 5) {
        this.banker.acceptCards(this.deck.take(1));
      }
      return;
    }
    const playerCardValue = this.player.score - playerScoreBefore;
    if (bankerScore === 7) {
      return;
    }
    if (bankerScore === 6 && [6, 7].includes(playerCardValue)) {
      return this.banker.acceptCards(this.deck.take(1));
    }
    if (bankerScore === 5 && [4, 5, 6, 7].includes(playerCardValue)) {
      return this.banker.acceptCards(this.deck.take(1));
    }
    if (bankerScore === 4 && [2, 3, 4, 5, 6, 7].includes(playerCardValue)) {
      return this.banker.acceptCards(this.deck.take(1));
    }
    if (
      bankerScore === 3 &&
      [0, 1, 2, 3, 4, 5, 6, 7, 9].includes(playerCardValue)
    ) {
      return this.banker.acceptCards(this.deck.take(1));
    }
    return this.banker.acceptCards(this.deck.take(1));
  }

  private getRoundResult(): IRoundResult {
    let winner: BetWinner;
    if (this.banker.score === this.player.score) {
      winner = BetWinner.Tie;
    } else {
      winner =
        this.banker.score < this.player.score
          ? BetWinner.Player
          : BetWinner.Banker;
    }

    const prize = this.user.bet.amount
      ? this.calculatePrize(this.user.bet, winner)
      : null;

    return {
      earnings: prize,
      winner,
      userStatus: this.user.bet.amount
        ? winner === this.user.bet.winner
          ? UserResultStatus.Won
          : UserResultStatus.Lose
        : UserResultStatus.NotPlayed,
    };
  }

  private calculatePrize(bet: Bet, result: BetWinner) {
    if (bet.winner !== result) {
      return 0;
    }
    if (result === BetWinner.Player) {
      return bet.amount * 2;
    } else if (result == BetWinner.Banker) {
      return bet.amount * 1.95;
    } else if (result === BetWinner.Tie) {
      return bet.amount * 8;
    } else {
      throw new Error(`Unknown winner result ${bet.winner}`);
    }
  }
}
