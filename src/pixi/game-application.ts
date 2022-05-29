import { Application, Sprite, Text } from 'pixi.js';
import { BaccaratGameRoom, GameStatus } from 'game/baccarat-game-room';

import { ASSETS } from './assets';
import { BetSlot } from './bet-slot';
import { BetWinner } from 'game/model';
import { Cards } from './cards';
import { GameControls } from './game-controls';
import { GameManager } from './game-manager';
import { UserActions } from './user-actions';
import { UserStatus } from './user-status';

export class GameApplication {
  setStop(stop: boolean): void {
    this.stopText.visible = stop;
  }
  slots: BetSlot[] = [];
  readonly app: Application;
  statusText: Text;
  stopText: Text;

  bankerCards: Cards;
  playerCards: Cards;

  userStatus: UserStatus;
  loaded = false;

  manager: GameManager;

  constructor(
    private container: HTMLElement,
    private room: BaccaratGameRoom,
    private onLoad: () => void
  ) {
    this.app = new Application({
      width: 1280,
      height: 720,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
      antialias: true,
    });

    this.loadAssets();
    this.app.loader.onLoad.add(this.onLoaded);
    this.app.loader.onError.add(() => console.log('Error!'));
    this.app.loader.load();
  }

  init(): void {
    this.container.appendChild(this.app.view);
    this.slots = this.getRects();
    this.bankerCards = new Cards(this.app, {
      x: this.app.view.width / 2 + 10,
      y: this.app.view.height / 5 + 10,
    });
    this.playerCards = new Cards(this.app, {
      x: this.app.view.width / 2 - 140,
      y: this.app.view.height / 5 + 10,
    });
    this.userStatus = new UserStatus(this.app);
    const background = new Sprite(
      this.app.loader.resources['bg_game.jpg'].texture
    );
    background.width = 1280;
    background.height = 720;
    this.app.stage.addChild(background);
    this.app.stage.addChild(...this.slots);
    this.app.stage.addChild(this.bankerCards);
    this.app.stage.addChild(this.playerCards);
    this.app.stage.addChild(this.userStatus);
    this.app.stage.addChild(new UserActions(this.app, this.manager));
    this.statusText = this.createStatusText();
    this.app.stage.addChild(this.statusText);
    this.app.stage.addChild(new GameControls(this.app, this.manager));
    this.stopText = this.createStopText();
    this.app.stage.addChild(this.stopText);
  }

  private onLoaded = () => {
    this.loaded = true;
    this.onLoad();
  };

  private loadAssets(): void {
    this.app.loader.baseUrl = 'assets';
    ASSETS.forEach((file) => this.app.loader.add(file, file));
  }

  private createStatusText(): Text {
    const text = new Text(this.room.status, { fill: 0xffffff });
    text.anchor.set(0.5, 0.5);
    text.x = this.app.view.width / 5;
    text.y = 30;
    return text;
  }

  private createStopText(): Text {
    const text = new Text('Game is now being stopped...', { fill: 0xffffff });
    text.anchor.set(0.5, 0.5);
    text.x = this.app.view.width / 5;
    text.y = 60;
    text.visible = false;
    return text;
  }

  getRects(): BetSlot[] {
    return [
      new BetSlot(
        {
          x: 1280 / 2 - 350 / 2,
          y: 545,
          width: 350,
          height: 110,
          text: BetWinner.Player,
        },
        this.manager
      ),
      new BetSlot(
        {
          x: 1280 / 2 - 280 / 2,
          y: 440,
          width: 280,
          height: 85,
          text: BetWinner.Banker,
        },
        this.manager
      ),
      new BetSlot(
        {
          x: 1280 / 2 - 230 / 2,
          y: 350,
          width: 230,
          height: 75,
          text: BetWinner.Tie,
        },
        this.manager
      ),
    ];
  }

  setStatus(status: GameStatus): void {
    this.statusText.text = status;
  }
}
