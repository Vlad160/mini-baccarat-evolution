export abstract class Animation {
  abstract play(...args: any[]): Promise<void>;

  easeOutExpo(t: number, b: number, c: number, d: number): number {
    return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
  }

  easeLinear(t: number, b: number, c: number, d: number): number {
    return (c * t) / d + b;
  }
}
