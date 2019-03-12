const { assert } = require('chai');

const mergePolygons = require('../src/merge-polygons');

/**
 * Adapt and extend the test suite to specifiy the expected behaivour of mergePolygons()
 */
describe("mergePolygons", () => {

    it("should return undefined when undefined polygons passed", () => {

        assert.isUndefined(mergePolygons(undefined, undefined));
    });
});