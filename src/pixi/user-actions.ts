import { Application, Container } from 'pixi.js';

import { ActionButton } from './action-button';
import { GameManager } from './game-manager';

export class UserActions extends Container {
  private dealAction: ActionButton;
  private clearAction: ActionButton;

  constructor(private app: Application, private manager: GameManager) {
    super();

    this.dealAction = new ActionButton('Deal', this.onDeal);
    this.clearAction = new ActionButton('Clear', this.onClear);
    this.clearAction.x = this.dealAction.width + 5;

    this.y = this.app.view.height - 120;
    this.x = this.app.view.width - 200;

    this.addChild(this.dealAction, this.clearAction);
  }

  onDeal = () => {
    this.manager.dealBet();
  };

  onClear = () => {
    this.manager.clearBet();
  };
}
