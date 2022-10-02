export class Simulator {
  private timer: number

  constructor(initialTimer: number) {
    this.timer = initialTimer
  }

  loop(): number {
    this.timer++
    return this.timer
  }
}
