import { IObjectPosition, IRectangle, SimObject, Simulator } from '../index.js'

import { faker } from '@faker-js/faker'
import {
  MSG_ERR_DIMENSIONS_NOT_SET,
  MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_HIGHER,
  MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_LOWER,
  MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_HIGHER,
  MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_LOWER
} from '../constants.js'

describe('Simulator', () => {
  describe('no dimensions set', () => {
    it('loop throws exception if dimensions are not set', () => {
      const step = faker.datatype.number()
      const simulator = new Simulator(step)

      expect(simulator.getDimensions()).toBeUndefined()
      expect(() => simulator.loop()).toThrowError(MSG_ERR_DIMENSIONS_NOT_SET)
    })
  })

  describe('dimensions are set', () => {
    it('increments step', () => {
      const initialTimer = faker.datatype.number()
      const dimensions: IRectangle = {
        x: faker.datatype.number(),
        y: faker.datatype.number()
      }

      const simulator = new Simulator(initialTimer, dimensions)

      expect(simulator.getDimensions()).toBe(dimensions)
      expect(simulator.loop()).toBe(initialTimer + 1)
    })
  })

  describe('Simulator::spawn', () => {
    let simulator: Simulator

    const dimensions: IRectangle = {
      x: faker.datatype.number(),
      y: faker.datatype.number(),
    }

    beforeEach(() => {
      simulator = new Simulator(faker.datatype.number(), dimensions)
    })

    it.each([
      { position: { x: -1, y: 0 }, err: MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_LOWER },
      { position: { x: dimensions.x + 1, y: 0 }, err: MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_X_HIGHER },
      { position: { x: 0, y: -1 }, err: MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_LOWER },
      { position: { x: 0, y: dimensions.y + 1 }, err: MSG_ERR_OBJECT_OUT_OF_BOUNDARIES_Y_HIGHER },
    ])('$err', (data: { position: IObjectPosition, err: string }) => {
      expect(() => simulator.spawn(new SimObject(), data.position)).toThrowError(data.err)
    })

    it('should push to Simulator::objects a new SimObjectWrapper', () => {
      const position: IObjectPosition = {
        x: faker.datatype.number({ min: 0, max: dimensions.x }),
        y: faker.datatype.number({ min: 0, max: dimensions.y }),
      }

      simulator.spawn(new SimObject(), position)

      expect(simulator.getObjects()).toHaveLength(1)
    })
  })
})
