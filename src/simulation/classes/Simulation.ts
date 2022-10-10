import {
  MSG_ERR_DIMENSIONS_NOT_SET,
  MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_HIGHER,
  MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_LOWER,
  MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_HIGHER,
  MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_LOWER
} from "../constants.js"
import { SimObjectWrapper } from "./SimObjectWrapper.js"

import {
  EnumObjectCommand,
  EnumObjectOrientation,
  IObjectPosition,
  IRectangle,
  ISimObjectWrapper,
  ISimulationStep
} from "../types.js"

export class Simulation {
  private steps: ISimulationStep[] = []

  constructor(
    private step: number,
    private dimensions?: IRectangle,
    private objects: SimObjectWrapper[] = []
  ) {
    if (this.objects.length > 0) {
      this.setObjects(objects)
      this.createSimulationStep()
    }
  }

  loop(): number {
    if (!this.dimensions) throw Error(MSG_ERR_DIMENSIONS_NOT_SET)

    this.calculateNextStep()

    this.calculateNextCommands()

    this.createSimulationStep()

    this.step++

    return this.step
  }

  createSimulationStep(): void {
    this.steps.push(this.getCurrentStatus())
  }

  getCurrentStatus(): ISimulationStep {
    const objects: ISimObjectWrapper[] = this.getObjects().map(simObjectWrapper => ({
      dynamic: simObjectWrapper.dynamic,
      position: simObjectWrapper.getPosition(),
    }))

    return { objects }
  }

  getSimulationJSON(): string {
    return JSON.stringify(this.steps)
  }

  calculateNextStep(): void {
    for (const objectWrapper of this.getDynamicObjects()) {
      this.calculateObjectNextStep(objectWrapper)
    }
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
    const nextPosition = this.calculateObjectWrapperNextPosition(
      objectWrapper.getPosition(),
      objectWrapper.getOrientation()
    )

    const beyondBoundaries = nextPosition.x < 1 || nextPosition.x > this.dimensions.x || nextPosition.y < 1 || nextPosition.y > this.dimensions.y

    const noObstacle = this.objects.filter(objectWrapper => objectWrapper.getPosition().x === nextPosition.x && objectWrapper.getPosition().y === nextPosition.y).length === 0

    return !beyondBoundaries && noObstacle
  }

  calculateObjectWrapperNextPosition(position: IObjectPosition, orientation: EnumObjectOrientation): IObjectPosition {
    let nextPosition: IObjectPosition

    switch (orientation) {
      case EnumObjectOrientation.YPOS:
        nextPosition = { x: position.x, y: position.y + 1 }
        break;

      case EnumObjectOrientation.YNEG:
        nextPosition = { x: position.x, y: position.y - 1 }
        break;

      case EnumObjectOrientation.XPOS:
        nextPosition = { x: position.x + 1, y: position.y }
        break;

      case EnumObjectOrientation.XNEG:
        nextPosition = { x: position.x - 1, y: position.y }
        break;
    }

    return nextPosition
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

    this.createSimulationStep()
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
