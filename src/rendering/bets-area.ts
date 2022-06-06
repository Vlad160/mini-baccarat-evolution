import { BetWinner, IRoundResult } from '@game';
import { Application, Container } from 'pixi.js';
import { BetArea } from './bet-area';
import { GameManager } from './game-manager';
import { Dimensions } from './models';
import { SoundManager } from './sound-manager';

const PLAYER_AREA_WIDTH = 350;
const PLAYER_AREA_HEIGHT = 110;
const BANKER_AREA_WIDTH = 280;
const BANKER_AREA_HEIGHT = 85;
const TIE_AREA_WIDTH = 230;
const TIE_AREA_HEIGHT = 75;

export class BetsArea extends Container {
  private areas: BetArea[];

  constructor(
    dimensions: Dimensions,
    private app: Application,
    private manager: GameManager,
    private soundManager: SoundManager
  ) {
    super();
    this.areas = this.getBetAreas(dimensions);
    this.addChild(...this.areas);
  }

  private getBetAreas(dimensions: Dimensions): BetArea[] {
    return [
      new BetArea(
        {
          x: (dimensions.width - PLAYER_AREA_WIDTH) / 2,
          y: 545 * 1.25,
          width: PLAYER_AREA_WIDTH,
          height: PLAYER_AREA_HEIGHT,
          type: BetWinner.Player,
        },
        this.manager,
        dimensions,
        this.app,
        this.soundManager
      ),
      new BetArea(
        {
          x: (dimensions.width - BANKER_AREA_WIDTH) / 2,
          y: 440 * 1.25,
          width: BANKER_AREA_WIDTH,
          height: BANKER_AREA_HEIGHT,
          type: BetWinner.Banker,
        },
        this.manager,
        dimensions,
        this.app,
        this.soundManager
      ),
      new BetArea(
        {
          x: (dimensions.width - TIE_AREA_WIDTH) / 2,
          y: 350 * 1.25,
          width: TIE_AREA_WIDTH,
          height: TIE_AREA_HEIGHT,
          type: BetWinner.Tie,
        },
        this.manager,
        dimensions,
        this.app,
        this.soundManager
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
