import { EnumObjectCommand, EnumObjectOrientation, IObjectPosition, ISimObjectWrapper } from "../types.js"
import { SimObject } from "./SimObject.js"

export class SimObjectWrapper {
  private command = EnumObjectCommand.STOP
  private orientation = EnumObjectOrientation.YPOS

  constructor(
    private simObject: SimObject,
    private position: IObjectPosition,
    public dynamic: boolean = false,
  ) { }

  getCurrentStatus(): ISimObjectWrapper {
    return {
      dynamic: this.dynamic,
      position: this.getPosition()
    }
  }

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

