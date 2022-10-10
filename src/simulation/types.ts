import { SimObject } from "./classes/SimObject.js"

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

export interface ISimObjectWrapper {
  position: IObjectPosition
  dynamic: boolean
}