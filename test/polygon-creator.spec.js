const { assert } = require('chai');

const Vector2 = require('../src/vector2');

const helpers = require('./helpers.js');


describe("buildPolygon", () => {

    it("should correctly define halfEdge pairs when used to build a polygon", () => {
        const halfEdge = helpers.square()[0];

        assert.deepEqual(halfEdge.position, new Vector2(-0.45,-0.45));
        assert.deepEqual(halfEdge.pair.position, new Vector2(-0.45,0.45));

        assert.deepEqual(halfEdge.next.position, new Vector2(-0.45,0.45));
        assert.deepEqual(halfEdge.pair.next.position, new Vector2(-0.45,-0.45));

        assert.deepEqual(halfEdge.prev.position, new Vector2(0.45,-0.45));
        assert.deepEqual(halfEdge.pair.prev.position, new Vector2(0.45,0.45));
    });
});