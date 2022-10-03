export interface Rectangle {
  x: number
  y: number
}

export class Simulator {
  constructor(private timer: number, private dimensions?: Rectangle) { }

  loop(): number {
    if (!this.dimensions) throw Error('Simulator dimensions are not set')

    this.timer++

    return this.timer
  }

  getDimensions(): Rectangle {
    return this.dimensions
  }
}
