/* eslint-disable no-undef */
import { expect } from 'chai'
import { Shape } from '../src/shape.js'
import { shapeTypes } from '../src/constants.js'

describe('Shapes', () => {
    it('Rotating a shape should be consistent.', () => {
        const shape = new Shape(0, 1, 0, 0, 0)
        expect(shape.getCoordinates(8), "Shape coordinates after 8 rotations").to.deep.equal(shape.getCoordinates())
        expect(shape.getCoordinates(3), "Shape coordinates after 3 rotations").to.deep.equal(shape.getCoordinates(7))
        expect(shape.getCoordinates(1), "Shape coordinates after 1 rotation").to.not.deep.equal(shape.getCoordinates())
    })
    it('All shapes should be returned by getRandomShape', () => {
        const gottenTypes = new Set()
        for (let i = 0; i < 1000; i++) {
            const type = Shape.getRandomShapeType()
            gottenTypes.add(type)
            if (gottenTypes.size === shapeTypes.length) {
                break
            }
            expect(type, "Random type.").to.be.below(shapeTypes.length).and.above(-1)
        }
        expect(gottenTypes.size, "Number of different types returned by getRandomShapeType").to.equal(shapeTypes.length)
    })
})
