import { Application, Sprite, Text } from 'pixi.js';
import { ASSETS } from './assets';
import { BetsArea } from './bets-area';
import { Cards } from './cards';
import { GameControls } from './game-controls';
import { GameManager } from './game-manager';
import { RoundStatus } from './round-status';
import { StatusPanel } from './status-panel';
import { UserActions } from './user-actions';
import { UserStatus } from './user-status';

const PLAYER_CARDS_OFFSET_X = 25;
const BANKER_CARDS_OFFSET_X = 10;

export class GameApplication {
  userActions: UserActions;
  gameControls: GameControls;
  statusPanel: StatusPanel;

  betAreas: BetsArea;
  readonly app: Application;
  statusText: Text;
  stopText: Text;

  bankerCards: Cards;
  playerCards: Cards;

  userStatus: UserStatus;
  loaded = false;

  manager: GameManager;
  roundStatus: RoundStatus;

  constructor(private container: HTMLElement, private onLoad: () => void) {
    this.app = new Application({
      width: 1280,
      height: 720,
      backgroundColor: 0x1099bb,
      resolution: 1,
      antialias: true,
    });

    this.loadAssets();
    this.app.loader.onComplete.add(this.onLoaded);
    this.app.loader.onError.add(() => console.log('Error!'));
    this.app.loader.load();
  }

  init(): void {
    this.container.appendChild(this.app.view);
    this.betAreas = new BetsArea(this.app, this.manager);

    const playerX = (3 / 8) * this.app.view.width + PLAYER_CARDS_OFFSET_X;
    const bankerX = this.app.view.width / 2 + BANKER_CARDS_OFFSET_X;

    const playerY = this.app.view.height / 5 + 10;
    const bankerY = playerY;

    const playerSwipe = -this.app.view.width / 8 - 20;
    const bankerSwipe = playerSwipe + (playerX - bankerX);
    this.roundStatus = new RoundStatus(this.app.ticker, {
      x: this.app.view.width / 2,
      y: this.app.view.height / 2,
    });

    this.playerCards = new Cards(
      this.app,
      {
        x: playerX,
        y: playerY,
      },
      { x: playerSwipe, y: 10 }
    );

    this.bankerCards = new Cards(
      this.app,
      {
        x: bankerX,
        y: bankerY,
      },
      { x: bankerSwipe, y: 10 }
    );
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
      this.betAreas,
      this.bankerCards,
      this.playerCards,
      this.userStatus,
      this.userActions,
      this.statusPanel,
      this.roundStatus,
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
}
