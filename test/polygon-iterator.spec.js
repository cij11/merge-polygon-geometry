const { assert } = require('chai');

const PolygonIterator = require('../src/polygon-iterator');

const helpers = require('./helpers');

describe("iteratesOverEveryHalfEdge", () => {

    it("should iterate over every half edge in the polygon", () => {
        let triangle = helpers.triangle()[0];
        let polygonIterator = new PolygonIterator(triangle);
        let count = 0;

        for (let iteratedHalfEdge of polygonIterator) {
            let indexedHalfEdge = helpers.getHalfEdgeByIndex(triangle, count);
            assert.approximately(iteratedHalfEdge.position.x, indexedHalfEdge.position.x, 0.000001);
            assert.approximately(iteratedHalfEdge.position.y, indexedHalfEdge.position.y, 0.000001);
            count++
        }
        assert.equal(count, 3);
    });
});