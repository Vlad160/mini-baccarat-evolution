import { BetWinner } from '@game';
import { Application, Sprite, Text } from 'pixi.js';
import { ASSETS } from './assets';
import { BetArea } from './bet-area';
import { Cards } from './cards';
import { GameControls } from './game-controls';
import { GameManager } from './game-manager';
import { StatusPanel } from './status-panel';
import { UserActions } from './user-actions';
import { UserStatus } from './user-status';

export class GameApplication {
  userActions: UserActions;
  gameControls: GameControls;
  statusPanel: StatusPanel;

  betAreas: BetArea[] = [];
  readonly app: Application;
  statusText: Text;
  stopText: Text;

  bankerCards: Cards;
  playerCards: Cards;

  userStatus: UserStatus;
  loaded = false;

  manager: GameManager;

  constructor(private container: HTMLElement, private onLoad: () => void) {
    this.app = new Application({
      width: 1280,
      height: 720,
      backgroundColor: 0x1099bb,
      resolution: 1,
      antialias: true,
    });

    this.loadAssets();
    this.app.loader.onLoad.add(this.onLoaded);
    this.app.loader.onError.add(() => console.log('Error!'));
    this.app.loader.load();
  }

  init(): void {
    this.container.appendChild(this.app.view);
    this.betAreas = this.getBetAreas();
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

    this.userActions = new UserActions(this.app, this.manager);
    this.statusPanel = new StatusPanel();
    this.gameControls = new GameControls(this.app, this.manager);
    this.stopText = this.createStopText();
    this.app.stage.addChild(
      background,
      ...this.betAreas,
      this.bankerCards,
      this.playerCards,
      this.userStatus,
      this.userActions,
      this.statusPanel,
      // this.gameControls,
      this.stopText
    );
  }

  setStop(stop: boolean): void {
    this.stopText.visible = stop;
  }

  private onLoaded = () => {
    this.loaded = true;
    this.onLoad();
  };

  private loadAssets(): void {
    this.app.loader.baseUrl = 'assets';
    ASSETS.forEach((file) => this.app.loader.add(file, file));
  }

  private createStopText(): Text {
    const text = new Text('Game is now being stopped...', { fill: 0xffffff });
    text.anchor.set(0.5, 0.5);
    text.x = this.app.view.width / 5;
    text.y = 60;
    text.visible = false;
    return text;
  }

  private getBetAreas(): BetArea[] {
    return [
      new BetArea(
        {
          x: 1280 / 2 - 350 / 2,
          y: 545,
          width: 350,
          height: 110,
          type: BetWinner.Player,
        },
        this.manager
      ),
      new BetArea(
        {
          x: 1280 / 2 - 280 / 2,
          y: 440,
          width: 280,
          height: 85,
          type: BetWinner.Banker,
        },
        this.manager
      ),
      new BetArea(
        {
          x: 1280 / 2 - 230 / 2,
          y: 350,
          width: 230,
          height: 75,
          type: BetWinner.Tie,
        },
        this.manager
      ),
    ];
  }
}
