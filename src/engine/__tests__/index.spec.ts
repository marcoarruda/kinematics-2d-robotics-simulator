import { EnumObjectCommand, EnumObjectOrientation, IObjectPosition, IRectangle, SimObject, SimObjectWrapper, Simulator } from '../index.js'

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
      const simObjectWrapper = new SimObjectWrapper(new SimObject(), data.position)
      expect(() => simulator.spawn(simObjectWrapper)).toThrowError(data.err)
    })

    it('should push to Simulator::objects a new SimObjectWrapper', () => {
      const position: IObjectPosition = {
        x: faker.datatype.number({ min: 0, max: dimensions.x }),
        y: faker.datatype.number({ min: 0, max: dimensions.y }),
      }

      const simObjectWrapper = new SimObjectWrapper(new SimObject(), position)

      simulator.spawn(simObjectWrapper)

      expect(simulator.getObjects()).toHaveLength(1)
    })
  })

  describe('Simulator::getObjects', () => {
    it('should return all objects', () => {
      const simulation = new Simulator(0, { x: 10, y: 10 })

      const objects = [
        new SimObjectWrapper(new SimObject(), { x: 0, y: 0 }, false),
        new SimObjectWrapper(new SimObject(), { x: 1, y: 0 }, true)
      ]

      simulation.setObjects(objects)

      expect(simulation.getObjects()).toHaveLength(objects.length)
    })
  })

  describe('Simulator::getDynamicObjects', () => {
    it('should return only dynamic objects', () => {
      const simulation = new Simulator(0, { x: 10, y: 10 })

      const staticObjects = [
        new SimObjectWrapper(new SimObject(), { x: 0, y: 0 }, false),
        new SimObjectWrapper(new SimObject(), { x: 1, y: 0 }, false)
      ]

      const dynamicObjects = [
        new SimObjectWrapper(new SimObject(), { x: 2, y: 0 }, true),
      ]

      simulation.setObjects([...staticObjects, ...dynamicObjects])

      expect(simulation.getDynamicObjects()).toHaveLength(dynamicObjects.length)
    })
  })

  describe('Simulator::calculateObjectNextStep', () => {
    let simulation: Simulator, dimensions: IRectangle

    beforeAll(() => {
      dimensions = {
        x: 5,
        y: 5,
      }
      simulation = new Simulator(0, dimensions)
    })

    describe('Command: STOP', () => {
      it('should stay at the same place if command is STOP', () => {
        const object = new SimObject()
        const initialPosition: IObjectPosition = { x: 2, y: 2 }
        const objectWrapper = new SimObjectWrapper(object, initialPosition, true)

        simulation.setObjects([objectWrapper])

        objectWrapper.setCommand(EnumObjectCommand.STOP)

        const result = simulation.calculateObjectNextStep(objectWrapper)

        expect(result).toBe(true)
        expect(objectWrapper.getPosition()).toEqual(initialPosition)
      })
    })

    describe('Command: FORWARD', () => {
      it.each([
        { orientation: EnumObjectOrientation.YPOS, expectedPosition: { x: 2, y: 3 } },
        { orientation: EnumObjectOrientation.YNEG, expectedPosition: { x: 2, y: 1 } },
        { orientation: EnumObjectOrientation.XPOS, expectedPosition: { x: 3, y: 2 } },
        { orientation: EnumObjectOrientation.XNEG, expectedPosition: { x: 1, y: 2 } },
      ])('should go forward if there is space', (data: { orientation: EnumObjectOrientation, expectedPosition: IObjectPosition }) => {
        const object = new SimObject()
        const initialPosition: IObjectPosition = { x: 2, y: 2 }
        const objectWrapper = new SimObjectWrapper(object, initialPosition, true)

        objectWrapper.setCommand(EnumObjectCommand.FORWARD)
        objectWrapper.setOrientation(data.orientation)

        simulation.setObjects([objectWrapper])

        const result = simulation.calculateObjectNextStep(objectWrapper)

        expect(result).toBe(true)
        expect(objectWrapper.getPosition()).toEqual(data.expectedPosition)
      })
    })
  })
})
