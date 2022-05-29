import { action, computed, makeObservable, observable } from 'mobx';

export class Timer {
  @observable
  private _timeLeft: number;
  @computed
  public get timeLeft(): number {
    return this._timeLeft;
  }
  private set timeLeft(value: number) {
    this._timeLeft = value;
  }

  private timeoutId: number;
  private lastStartTime: number;
  private started = false;
  private endPromise: Promise<void>;
  private resolveEndPromise: () => void;

  constructor(private time: number, private tick: number = 1000) {
    makeObservable(this);
    this.timeLeft = time;
  }

  @action
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

  @action
  pause() {
    clearTimeout(this.timeoutId);
    this.timeLeft = Math.max(
      this.timeLeft - Date.now() - this.lastStartTime,
      0
    );
    this.timeoutId = null;
  }

  @action
  stop() {
    clearTimeout(this.timeoutId);
    this.timeLeft = this.time;
    this.endPromise = null;
    this.resolveEndPromise = null;
    this.started = false;
  }

  @action
  scheduleTick() {
    this.lastStartTime = Date.now();
    this.timeoutId = window.setTimeout(
      () => {
        this.timeLeft = Math.max(
          this.timeLeft - (Date.now() - this.lastStartTime),
          0
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
