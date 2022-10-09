import { EnumObjectCommand, EnumObjectOrientation, IObjectPosition } from "./types.js"

export class SimObject {
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

