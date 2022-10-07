import { MSG_ERR_DIMENSIONS_NOT_SET, MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_HIGHER, MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_LOWER, MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_HIGHER, MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_LOWER } from "./constants.js"

export interface IRectangle {
  x: number
  y: number
}

export interface IObjectPosition {
  x: number
  y: number
}

export enum EnumObjectOrientation {
  YPOS,
  YNEG,
  XPOS,
  XNEG,
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
  private command = EnumObjectCommand.STOP
  private orientation = EnumObjectOrientation.YPOS

  constructor(
    private simObject: SimObject,
    private position: IObjectPosition,
    public dynamic: boolean = false,
  ) { }

  getCommand(): EnumObjectCommand {
    return this.command
  }
  setCommand(command: EnumObjectCommand): void {
    this.command = command
  }

  getOrientation(): EnumObjectOrientation {
    return this.orientation
  }
  setOrientation(orientation: EnumObjectOrientation): void {
    this.orientation = orientation
  }

  getSimObject(): SimObject {
    return this.simObject
  }

  getPosition(): IObjectPosition {
    return this.position
  }
  setPosition(position: IObjectPosition): void {
    this.position = position
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

  calculateObjectNextStep(objectWrapper: SimObjectWrapper): boolean {
    if (objectWrapper.getCommand() === EnumObjectCommand.STOP) {
      return true
    }

    if (objectWrapper.getCommand() === EnumObjectCommand.FORWARD) {
      if (this.isForwardPossible(objectWrapper)) {
        this.setObjectWrapperNewPosition(objectWrapper)

        return true
      } else {
        return false
      }
    }

    return false
  }

  isForwardPossible(objectWrapper: SimObjectWrapper): boolean {
    let isPossible

    switch(objectWrapper.getOrientation()) {
      case EnumObjectOrientation.YPOS:
        isPossible = objectWrapper.getPosition().y < this.dimensions.y
        break;

      case EnumObjectOrientation.YNEG:
        isPossible = objectWrapper.getPosition().y > 1
        break;

      case EnumObjectOrientation.XPOS:
        isPossible = objectWrapper.getPosition().x < this.dimensions.x
        break;

      case EnumObjectOrientation.XNEG:
        isPossible = objectWrapper.getPosition().x > 1
        break;
    }

    return isPossible
  }

  setObjectWrapperNewPosition(objectWrapper: SimObjectWrapper): void {
    const currentPosition = objectWrapper.getPosition()

    switch (objectWrapper.getOrientation()) {
      case EnumObjectOrientation.YPOS:
        objectWrapper.setPosition({ x: currentPosition.x, y: currentPosition.y + 1 })
        break;

      case EnumObjectOrientation.YNEG:
        objectWrapper.setPosition({ x: currentPosition.x, y: currentPosition.y - 1 })
        break;

      case EnumObjectOrientation.XPOS:
        objectWrapper.setPosition({ x: currentPosition.x + 1, y: currentPosition.y })
        break;

      case EnumObjectOrientation.XNEG:
        objectWrapper.setPosition({ x: currentPosition.x - 1, y: currentPosition.y })
        break;
    }
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
