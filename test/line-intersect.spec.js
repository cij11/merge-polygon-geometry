const { assert } = require('chai');

const Vector2 = require('../src/vector2');

const lineIntersect = require('../src/line-intersect');

describe("segmentsIntersect", () => {

    it("should detect line segment intersections when present", () => {
        const horStart = new Vector2(-5, 0);
        const horEnd = new Vector2(5, 0);

        const vertStart = new Vector2(1, -4);
        const vertEnd = new Vector2(1, 4);

        let intersectionData = lineIntersect.lineSegmentIntersection(horStart, horEnd, vertStart, vertEnd);
        let expected = {position: new Vector2(1, 0), intersects: true};
        
        assert.deepEqual(intersectionData, expected);
    });
});

describe("segmentsDontIntersect", () => {

    it("should not detect line segment intersections when none present", () => {
        const horStart = new Vector2(-5, 0);
        const horEnd = new Vector2(5, 0);

        const vertStart = new Vector2(6, -4);
        const vertEnd = new Vector2(6, 4);

        let intersectionData = lineIntersect.lineSegmentIntersection(horStart, horEnd, vertStart, vertEnd);
        let expected = {position: null, intersects: false};
        
        assert.deepEqual(intersectionData, expected);
    });
});

describe("overlappingLines", () => {

    it("should not detect intersection for overlapping lines", () => {
        const horStart = new Vector2(-5, 0);
        const horEnd = new Vector2(5, 0);

        const vertStart = new Vector2(-5, 0);
        const vertEnd = new Vector2(5, 0);

        let intersectionData = lineIntersect.lineSegmentIntersection(horStart, horEnd, vertStart, vertEnd);
        let expected = {position: null, intersects: false};

        assert.deepEqual(intersectionData, expected);
    });
});

describe("colinearSharedVert", () => {

    it("should not detect intersection for colinear lines that share a vertex", () => {
        const horStart = new Vector2(-5, 0);
        const horEnd = new Vector2(5, 0);

        const vertStart = new Vector2(5, 0);
        const vertEnd = new Vector2(10, 0);

        let intersectionData = lineIntersect.lineSegmentIntersection(horStart, horEnd, vertStart, vertEnd);
        let expected = {position: null, intersects: false};;

        assert.deepEqual(intersectionData, expected);
    });
});

describe("tangentialSharedVert", () => {

    it("should not detect an intersection for tangential lines that share a vertex", () => {
        const horStart = new Vector2(-5, 1);
        const horEnd = new Vector2(5, 1);

        const vertStart = new Vector2(5, 1);
        const vertEnd = new Vector2(5, 10);

        let intersectionData = lineIntersect.lineSegmentIntersection(horStart, horEnd, vertStart, vertEnd);
        let expected = {position: null, intersects: false};;

        assert.deepEqual(intersectionData, expected);
    });
});