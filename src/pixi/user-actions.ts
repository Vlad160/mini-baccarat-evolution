import { Application, Container } from 'pixi.js';
import { ActionButton } from './action-button';
import { GameManager } from './game-manager';
import { Dimensions } from './models';

export class UserActions extends Container {
  disable() {
    this.dealAction.disable();
    this.clearAction.disable();
  }
  enable() {
    this.dealAction.enable();
    this.clearAction.enable();
  }
  private dealAction: ActionButton;
  private clearAction: ActionButton;

  constructor(
    dimensions: Dimensions,
    private app: Application,
    private manager: GameManager
  ) {
    super();

    const { height, width } = dimensions;

    const dealX = width - 200;
    const dealY = height - 120;

    this.dealAction = new ActionButton(
      'DEAL',
      this.app.loader.resources['deal-bet.png'].texture,
      0x99ff99,
      this.onDeal,
      { x: dealX, y: dealY }
    );

    const clearX = dealX + this.dealAction.width + 5;
    const clearY = height - 150;

    this.clearAction = new ActionButton(
      'CLEAR',
      this.app.loader.resources['clear-bet.png'].texture,
      0xff9999,
      this.onClear,
      {
        x: clearX,
        y: clearY,
      }
    );

    this.addChild(this.dealAction, this.clearAction);
  }

  onDeal = () => {
    this.manager.dealBet();
  };

  onClear = () => {
    this.manager.clearBet();
  };
}
