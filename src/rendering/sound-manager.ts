import { sound } from '@pixi/sound';
import { Loader } from 'pixi.js';

export const ASSET_MAP = {
  cardPlace: 'cardPlace.ogg',
  cardSlide: 'cardSlide.ogg',
  bgSound: 'bg-sound.mp3',
  chipsCollide: 'chipsCollide.ogg',
};

export class SoundManager {
  constructor(private readonly loader: Loader, public muted = false) {}

  loadAssets(): void {
    Object.entries(ASSET_MAP).forEach(([key, value]) => {
      if (this.loader.resources[key]) {
        return;
      }
      this.loader.add(key, value);
    });

    this.loader.onComplete.once(() => {
      this.backgroundMusic();
    });
  }

  backgroundMusic(): void {
    this.play('bgSound', { loop: true, volume: 0.1 });
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

  destroy(): void {
    sound.stopAll();
  }
}
