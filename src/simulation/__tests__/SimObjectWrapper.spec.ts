import { SimObject } from "../classes/SimObject.js"
import { SimObjectWrapper } from "../classes/SimObjectWrapper.js"
import { IObjectPosition } from "../types.js"

describe('SimObjectWrapper', () => {
  describe('getCurrentStatus', () => {
    it('should return plain object with proper values', () => {
      const dynamic = false
      const initialPosition: IObjectPosition = { x: 1, y: 2 }
      const simObjectWrapper = new SimObjectWrapper(new SimObject(), initialPosition, dynamic)

      const status = simObjectWrapper.getCurrentStatus()

      expect(status.dynamic).toBe(dynamic)
      expect(status.position).toBe(initialPosition)
    })
  })
})
