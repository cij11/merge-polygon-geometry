const { assert } = require('chai');

const Vector2 = require('../src/vector2');

const helpers = require('./helpers');
const mergePolygons = require('../src/merge-polygons');

/**
 * Adapt and extend the test suite to specify the expected behaviour of mergePolygons()
 */
describe("mergePolygons", () => {

    it("should return undefined when undefined polygons passed", () => {

        assert.isUndefined(mergePolygons(undefined, undefined));
    });
});

describe("nonOverlappingPolygons", () => {

    it("should return null when non-intersecting polygons are passed", () => {

        assert.isNull(mergePolygons(helpers.square()[0], helpers.nonOverlappingSquare()[0]));
    });
});

// Checks that use iterators start here
describe("squareTriangleMergeOuterBoundary", () => {

    it("should trace the outer boundary of a merged square and triangle correctly", () => {

        let mergedPolygonHalfEdge = mergePolygons(helpers.triangle()[0], helpers.square()[0]);

        let expectedVerts = [
            new Vector2(-0.5,-0.5),
            new Vector2(-0.45,-0.4),
            new Vector2(-0.45,0.45),
            new Vector2(-0.025,0.45),
            new Vector2(0,0.5),
            new Vector2(0.025,0.45),
            new Vector2(0.45,0.45),
            new Vector2(0.45,-0.4),
            new Vector2(0.5,-0.5),
        ];

        checkPolygon(mergedPolygonHalfEdge, expectedVerts);
    });
});

describe("squareTriangleMergeLowerInnerBoundary", () => {

    it("should trace the lower inner boundary of a merged square and triangle correctly", () => {

        let mergedPolygonHalfEdge = mergePolygons(helpers.triangle()[0], helpers.square()[0]);
        let lowerRightTriangleInner = mergedPolygonHalfEdge.pair;

        let expectedVerts = [
            new Vector2(-0.45,-0.4),
            new Vector2(-0.5,-0.5),
            new Vector2(0.5,-0.5),
            new Vector2(0.45,-0.4),
            new Vector2(0.45,-0.45),
            new Vector2(-0.45,-0.45),
        ];

        checkPolygon(lowerRightTriangleInner, expectedVerts);
    });
});

describe("rectangleSquareOuterBoundary", () => {

    it("should trace the outer boundary of a square and a rectangle as shown in merge.jpg correctly", () => {

        let mergedPolygonHalfEdge = mergePolygons(helpers.square()[0], helpers.horizontalRectangle()[0]);

        let expectedVerts = [
            new Vector2(-0.45,-0.45),
            new Vector2(-0.45,-0.2),
            new Vector2(-0.6,-0.2),
            new Vector2(-0.6,0.2),
            new Vector2(-0.45,0.2),
            new Vector2(-0.45,0.45),
            new Vector2(0.45,0.45),
            new Vector2(0.45,0.2),
            new Vector2(0.6,0.2),
            new Vector2(0.6,-0.2),
            new Vector2(0.45,-0.2),
            new Vector2(0.45,-0.45),
        ];

        checkPolygon(mergedPolygonHalfEdge, expectedVerts);
    });
});

describe("rectangleSquareCentralBoundary", () => {

    it("should trace the inner boundary of the central rectangle square and a rectangle as shown in merge.jpg correctly", () => {

        let mergedPolygonHalfEdge = mergePolygons(helpers.square()[0], helpers.horizontalRectangle()[0]);
        let innerTopLeft = mergedPolygonHalfEdge.next.pair.next.pair;

        let expectedVerts = [
            new Vector2(-0.45,0.2),
            new Vector2(-0.45,-0.2),
            new Vector2(0.45,-0.2),
            new Vector2(0.45,0.2),
        ];

        checkPolygon(innerTopLeft, expectedVerts);
    });
});

describe("overlappingSquareOuterBoundary", () => {

    it("should trace the outer boundary of overlapping squares correctly", () => {

        let mergedPolygonHalfEdge = mergePolygons(helpers.square()[0], helpers.overlappingSquare()[0]);

        let expectedVerts = [
            new Vector2(-0.45,-0.45),
            new Vector2(-0.45,0.45),
            new Vector2(-0.25, 0.45),
            new Vector2(-0.25,0.65),
            new Vector2(0.65, 0.65),
            new Vector2(0.65,-0.25),
            new Vector2(0.45,-0.25),
            new Vector2(0.45,-0.45),
        ];

        checkPolygon(mergedPolygonHalfEdge, expectedVerts);
    });
});

describe("overlappingSquareInnerBoundary", () => {

    it("should trace the inner boundary of overlapping squares correctly", () => {

        let mergedPolygonHalfEdge = mergePolygons(helpers.square()[0], helpers.overlappingSquare()[0]);
        let centralTopLeftEdge = mergedPolygonHalfEdge.next.pair.prev.pair;

        let expectedVerts = [
            new Vector2(-0.25,0.45),
            new Vector2(-0.25,-0.25),
            new Vector2(0.45, -0.25),
            new Vector2(0.45,0.45),
        ];

        checkPolygon(centralTopLeftEdge, expectedVerts);
    });
});

describe("concaveOverlapOuterBoundary", () => {

    it("should trace the outer boundary of overlapping objects, where one is a concave chevron and the other is a square", () => {

        let mergedPolygonHalfEdge = mergePolygons(helpers.chevron()[0], helpers.square()[0]);

        let expectedVerts = [
            new Vector2(-0.5,-0.5),
            new Vector2(-0.45,-0.4),
            new Vector2(-0.45,0.45),
            new Vector2(-0.025,0.45),
            new Vector2(0,0.5),
            new Vector2(0.025,0.45),
            new Vector2(0.45,0.45),
            new Vector2(0.45,-0.4),
            new Vector2(0.5,-0.5),
            new Vector2(0.45,-0.425),
            new Vector2(0.45,-0.45),
            new Vector2(-0.45,-0.45),
            new Vector2(-0.45,-0.425),
        ];

        checkPolygon(mergedPolygonHalfEdge, expectedVerts);
    });
});


function checkPolygon(halfEdge, vertices) {
    for (let i = 0; i < vertices.length; i++) {
        // Check along next edges
        assert.approximately(helpers.getHalfEdgeByIndex(halfEdge, i).position.x, vertices[i].x, 0.000001,
            "Vector.x did not match at index: " + i);
        assert.approximately(helpers.getHalfEdgeByIndex(halfEdge, i).position.y, vertices[i].y, 0.000001,
            "Vector.y did not match at index: " + i);

        // Check along prev edges
        assert.approximately(helpers.getHalfEdgeByIndex(halfEdge, -i - 1).position.x, vertices[vertices.length - i - 1].x, 0.000001,
            "Vector.x did not match following prev references at vertices index: " + (i - 1));
        assert.approximately(helpers.getHalfEdgeByIndex(halfEdge, -i - 1).position.y, vertices[vertices.length - i - 1].y, 0.000001,
            "Vector.x did not match following prev references at vertices index: " + (i - 1));
    }
}


