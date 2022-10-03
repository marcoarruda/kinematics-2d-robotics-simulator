import { MSG_ERR_DIMENSIONS_NOT_SET, MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_HIGHER, MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_LOWER, MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_HIGHER, MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_LOWER } from "./constants.js"

export interface IRectangle {
  x: number
  y: number
}

export interface IObjectPosition {
  x: number
  y: number
}

class SimObjectWrapper {
  constructor(private simObject: SimObject, private position: IObjectPosition) { }

  getSimObject(): SimObject {
    return this.simObject
  }

  getPosition(): IObjectPosition {
    return this.position
  }
}

export class Simulator {
  private objects: SimObjectWrapper[] = []

  constructor(private timer: number, private dimensions?: IRectangle) {
  }

  loop(): number {
    if (!this.dimensions) throw Error(MSG_ERR_DIMENSIONS_NOT_SET)

    this.timer++

    return this.timer
  }

  getDimensions(): IRectangle {
    return this.dimensions
  }

  getObjects(): SimObjectWrapper[] {
    return this.objects
  }

  spawn(object: SimObject, position: IObjectPosition): void {
    if (position.x < 0)
      throw new Error(MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_LOWER)
    if (position.x > this.dimensions.x)
      throw new Error(MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_HIGHER)
    if (position.y < 0)
      throw new Error(MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_LOWER)
    if (position.y > this.dimensions.y)
      throw new Error(MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_HIGHER)

    const simObjectWrapper = new SimObjectWrapper(object, position)

    this.objects.push(simObjectWrapper)
  }
}

export class SimObject {
}
