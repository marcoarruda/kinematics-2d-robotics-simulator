import { Simulator } from '../index.js'

import { faker } from '@faker-js/faker'

describe('Simulator', () => {
  describe('loop function', () => {
    it('increments timer', () => {
      const timer = faker.datatype.number()
      const simulator = new Simulator(timer)

      const result = simulator.loop()

      expect(result).toBe(timer + 1)
    })
  })
})
