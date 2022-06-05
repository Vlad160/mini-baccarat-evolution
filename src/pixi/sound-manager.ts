import { Loader } from 'pixi.js';
import { sound } from '@pixi/sound';

export class SoundManager {
  constructor(private readonly loader: Loader, public muted = false) {}

  loadAssets(): void {
    this.loader
      .add('cardPlace', 'cardPlace.ogg')
      .add('cardSlide', 'cardSlide.ogg')
      .add('bgSound', 'bg-sound.mp3')
      .add('chipsCollide', 'chipsCollide.ogg');

    this.loader.onComplete.once(() => {
      this.backgroundMusic();
    });
  }

  backgroundMusic(): void {
    this.play('bgSound', { loop: true, volume: 0.2 });
  }

  cardPlace(): void {
    this.play('cardPlace');
  }
  cardSlide(): void {
    this.play('cardSlide');
  }

  chipsCollide(): void {
    this.play('chipsCollide');
  }

  setMuted(muted: boolean): void {
    this.muted = muted;

    if (this.muted) {
      sound.stopAll();
    } else {
      this.backgroundMusic();
    }
  }

  private play(name: string, options: Record<string, any> = {}): void {
    if (!this.muted) {
      this.loader.resources[name].sound.play(options);
    }
  }
}
