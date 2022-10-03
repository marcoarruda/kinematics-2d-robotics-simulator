import { Rectangle, Simulator } from '../index.js'

import { faker } from '@faker-js/faker'
import { MSG_ERR_DIMENSIONS_NOT_SET } from '../constants.js'

describe('Simulator', () => {
  describe('no dimensions set', () => {
    it('loop throws exception if dimensions are not set', () => {
      const timer = faker.datatype.number()
      const simulator = new Simulator(timer)

      expect(simulator.getDimensions()).toBeUndefined()
      expect(() => simulator.loop()).toThrowError(MSG_ERR_DIMENSIONS_NOT_SET)
    })
  })

  describe('dimensions are set', () => {
    it('increments timer', () => {
      const initialTimer = faker.datatype.number()
      const dimensions: Rectangle = {
        x: faker.datatype.number(),
        y: faker.datatype.number()
      }

      const simulator = new Simulator(initialTimer, dimensions)

      expect(simulator.getDimensions()).toBe(dimensions)
      expect(simulator.loop()).toBe(initialTimer + 1)
    })
  })
})
