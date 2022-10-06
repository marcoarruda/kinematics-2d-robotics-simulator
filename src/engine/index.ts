import { MSG_ERR_DIMENSIONS_NOT_SET, MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_HIGHER, MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_LOWER, MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_HIGHER, MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_LOWER } from "./constants.js"

export interface IRectangle {
  x: number
  y: number
}

export interface IObjectPosition {
  x: number
  y: number
}

export enum EnumObjectCommand {
  STOP,
  FORWARD,
  TURN_LEFT_90,
  TURN_RIGHT_90,
}

export interface ISimulationStep {
  objects: SimObject
}

export class SimObjectWrapper {
  private command: EnumObjectCommand = EnumObjectCommand.STOP

  constructor(
    private simObject: SimObject,
    private position: IObjectPosition,
    public dynamic: boolean = false,
  ) { }

  getCommand(): EnumObjectCommand {
    return this.command
  }

  getSimObject(): SimObject {
    return this.simObject
  }

  getPosition(): IObjectPosition {
    return this.position
  }
}

export class Simulator {
  private objects: SimObjectWrapper[] = []

  constructor(private step: number, private dimensions?: IRectangle) {
  }

  loop(): number {
    if (!this.dimensions) throw Error(MSG_ERR_DIMENSIONS_NOT_SET)

    this.calculateNextStep()

    this.calculateNextCommands()

    this.step++

    return this.step
  }

  calculateNextStep(): void {
    for (const objectWrapper of this.getDynamicObjects()) {
      this.calculateObjectNextStep(objectWrapper)
    }
    return
  }

  calculateObjectNextStep(objectWrapper: SimObjectWrapper): void {
    return
  }

  calculateNextCommands(): void {
    return
  }

  setObjects(objects: SimObjectWrapper[]): void {
    for (const objectWrapper of objects) {
      this.spawn(objectWrapper)
    }
  }

  getDimensions(): IRectangle {
    return this.dimensions
  }

  getObjects(): SimObjectWrapper[] {
    return this.objects
  }

  getDynamicObjects(): SimObjectWrapper[] {
    return this.objects.filter(objectWrapper => objectWrapper.dynamic)
  }

  spawn(objectWrapper): void {
    if (objectWrapper.position.x < 0)
      throw new Error(MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_LOWER)
    if (objectWrapper.position.x > this.dimensions.x)
      throw new Error(MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_HIGHER)
    if (objectWrapper.position.y < 0)
      throw new Error(MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_LOWER)
    if (objectWrapper.position.y > this.dimensions.y)
      throw new Error(MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_HIGHER)

    this.objects.push(objectWrapper)
  }
}

export class SimObject {
}
