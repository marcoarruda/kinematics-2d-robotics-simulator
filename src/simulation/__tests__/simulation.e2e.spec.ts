import { Simulation } from "../classes/index.js"
import { stubObstacle } from "../stubs.js"
import { IRectangle } from "../types.js"

describe('Simulation 01', () => {
  let simulation: Simulation

  beforeAll(() => {
    const dimensions: IRectangle = {
      x: 20,
      y: 20,
    }
    simulation = new Simulation(0, dimensions)

    simulation.setObjects([
      stubObstacle({ x: 1, y: 2 }),
      stubObstacle({ x: 1, y: 3 }),
      stubObstacle({ x: 1, y: 4 }),
      stubObstacle({ x: 1, y: 5 }),
      stubObstacle({ x: 1, y: 6 }),
      stubObstacle({ x: 1, y: 7 }),
    ])
  })

  it('should have exact number of obstacles', () => {
    expect(simulation.getObjects()).toHaveLength(6)
  })
})
