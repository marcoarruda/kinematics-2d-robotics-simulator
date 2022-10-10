import { SimObject, SimObjectWrapper } from "./classes/index.js"
import { IObjectPosition } from "./types.js"

export const stubObstacle = (position: IObjectPosition): SimObjectWrapper => {
  return new SimObjectWrapper(new SimObject(), position, false)
}