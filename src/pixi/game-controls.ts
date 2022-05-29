import { Application, Container, Sprite, Texture } from 'pixi.js';
import { GameManager } from './game-manager';
import { IPoint } from './models';

const WIDTH = 64;
const HEIGHT = 64;
const MARGIN = 16;

export class GameControls extends Container {
  private play: Sprite;
  private stop: Sprite;
  private renew: Sprite;

  constructor(private app: Application, private manager: GameManager) {
    super();
    this.play = this.createSprite(
      this.app.loader.resources['play.png'].texture,
      { x: 0, y: 0 },
      this.manager.start.bind(this.manager)
    );
    this.stop = this.createSprite(
      this.app.loader.resources['stop.png'].texture,
      { x: WIDTH + MARGIN, y: 0 },
      this.manager.stop.bind(this.manager)
    );
    this.renew = this.createSprite(
      this.app.loader.resources['rotate.png'].texture,
      { x: (MARGIN + WIDTH) * 2, y: 0 },
      this.manager.reset.bind(this.manager)
    );

    this.addChild(this.play, this.stop, this.renew);
    this.x = this.app.view.width - this.width - MARGIN;
    this.y = MARGIN;
  }

  private createSprite(
    texture: Texture,
    offset: IPoint,
    onClick: () => void
  ): Sprite {
    const sprite = new Sprite(texture);
    sprite.x = offset.x;
    sprite.y = offset.y;
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.pivot.set(0.5, 0.5);
    sprite.width = WIDTH;
    sprite.height = HEIGHT;

    sprite.on('pointerover', () => {
      const scale = sprite.scale;
      sprite.scale.set(scale.x + 0.02, scale.y + 0.02);
      sprite.alpha = 0.8;
    });
    sprite.on('pointerout', () => {
      const scale = sprite.scale;
      sprite.scale.set(scale.x - 0.02, scale.y - 0.02);
      sprite.alpha = 1;
    });

    sprite.on('pointerdown', onClick);

    return sprite;
  }
}
