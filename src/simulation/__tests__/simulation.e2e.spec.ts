import { Simulation } from "../classes/index.js"
import { stubObstacle } from "../stubs.js"
import { IRectangle, ISimulationStep } from "../types.js"

describe('Simulation only with obstacles', () => {
  let simulation: Simulation
  const objects = [
    stubObstacle({ x: 1, y: 2 }),
    stubObstacle({ x: 1, y: 3 }),
    stubObstacle({ x: 1, y: 4 }),
    stubObstacle({ x: 1, y: 5 }),
    stubObstacle({ x: 1, y: 6 }),
    stubObstacle({ x: 1, y: 7 }),
  ]

  beforeAll(() => {
    const dimensions: IRectangle = {
      x: 20,
      y: 20,
    }
    simulation = new Simulation(0, dimensions)

    console.log('before setObjects')

    simulation.setObjects(objects)
  })

  describe('getCurrentStatus before any loops', () => {
    it('should return list of objects with their status', () => {
      const step: ISimulationStep = simulation.getCurrentStatus()

      expect(step.objects).toHaveLength(6)
    })

    it.each(objects.map((object, index) => ({ object, index })))('should retrieve interfaces for each object', (data) => {
      const step: ISimulationStep = simulation.getCurrentStatus()

      expect(data.object.dynamic).toBe(step.objects.at(data.index).dynamic)
      expect(data.object.getPosition()).toBe(step.objects.at(data.index).position)
    })
  })

  describe('getCurrentStatus after 1 loop', () => {
    it('should increase step number', () => {
      const stepIndex = simulation.loop()

      expect(stepIndex).toBe(1)
    })

    it('should have same values after 1 loop with static objects', () => {
      const step: ISimulationStep = simulation.getCurrentStatus()

      expect(step.objects).toHaveLength(6)
    })

    it.each(objects.map((object, index) => ({ object, index })))('should retrieve interfaces for each object', (data) => {
      const step: ISimulationStep = simulation.getCurrentStatus()

      expect(data.object.dynamic).toBe(step.objects.at(data.index).dynamic)
      expect(data.object.getPosition()).toBe(step.objects.at(data.index).position)
    })
  })
})
