import { BetWinner, IRoundResult } from '@game';
import { Application, Container } from 'pixi.js';
import { BetArea } from './bet-area';
import { GameManager } from './game-manager';

const PLAYER_AREA_WIDTH = 350;
const PLAYER_AREA_HEIGHT = 110;
const BANKER_AREA_WIDTH = 280;
const BANKER_AREA_HEIGHT = 85;
const TIE_AREA_WIDTH = 230;
const TIE_AREA_HEIGHT = 75;

export class BetsArea extends Container {
  private areas: BetArea[];

  constructor(private app: Application, private manager: GameManager) {
    super();
    this.areas = this.getBetAreas();
    this.addChild(...this.areas);
  }

  private getBetAreas(): BetArea[] {
    return [
      new BetArea(
        {
          x: (this.app.view.width - PLAYER_AREA_WIDTH) / 2,
          y: 545,
          width: PLAYER_AREA_WIDTH,
          height: PLAYER_AREA_HEIGHT,
          type: BetWinner.Player,
        },
        this.manager,
        this.app
      ),
      new BetArea(
        {
          x: (this.app.view.width - BANKER_AREA_WIDTH) / 2,
          y: 440,
          width: BANKER_AREA_WIDTH,
          height: BANKER_AREA_HEIGHT,
          type: BetWinner.Banker,
        },
        this.manager,
        this.app
      ),
      new BetArea(
        {
          x: (this.app.view.width - TIE_AREA_WIDTH) / 2,
          y: 350,
          width: TIE_AREA_WIDTH,
          height: TIE_AREA_HEIGHT,
          type: BetWinner.Tie,
        },
        this.manager,
        this.app
      ),
    ];
  }

  setRoundResult(result: IRoundResult): void {
    this.areas.forEach((area) => area.clearArea(result));
  }

  setAmount(amount: number, winner: BetWinner): void {
    this.areas.forEach((slot) =>
      winner === slot.config.type && amount > 0
        ? slot.setAmount(amount)
        : slot.setAmount(0)
    );
  }
}
