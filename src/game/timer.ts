import { action, computed, makeObservable, observable } from 'mobx';

export class Timer {
  timeLeft: number;

  private timeoutId: number;
  private lastStartTime: number;
  private started = false;
  private endPromise: Promise<void>;
  private resolveEndPromise: () => void;

  constructor(private time: number, private tick: number = 1000) {
    this.timeLeft = time;

    makeObservable(this, {
      timeLeft: observable,
      setTimeLeft: action,
      pause: action,
      scheduleTick: action,
      start: action,
      stop: action,
    });
  }

  setTimeLeft(time: number): void {
    this.timeLeft = time;
  }

  start(): Promise<void> {
    if (this.started) {
      return this.endPromise;
    }
    this.started = true;
    this.endPromise = new Promise(
      (resolve) => (this.resolveEndPromise = resolve)
    );
    this.scheduleTick();
    return this.endPromise;
  }

  pause() {
    clearTimeout(this.timeoutId);
    this.setTimeLeft(
      Math.max(this.timeLeft - Date.now() - this.lastStartTime, 0)
    );
    this.timeoutId = null;
  }

  stop() {
    clearTimeout(this.timeoutId);
    this.setTimeLeft(this.time);
    this.endPromise = null;
    this.resolveEndPromise = null;
    this.started = false;
  }

  scheduleTick() {
    this.lastStartTime = Date.now();
    this.timeoutId = window.setTimeout(
      () => {
        this.setTimeLeft(
          Math.max(this.timeLeft - (Date.now() - this.lastStartTime), 0)
        );
        if (this.timeLeft !== 0) {
          this.scheduleTick();
        } else {
          this.timeoutId = null;
          this.resolveEndPromise();
        }
      },
      this.timeLeft < this.tick ? this.timeLeft : this.tick
    );
  }
}
