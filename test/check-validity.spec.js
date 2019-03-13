const { assert } = require('chai');

const HalfEdge = require('../src/half-edge');

const checkValidity = require('../src/check-validity');
const helpers = require('./helpers');

describe("checkValidityTrue", () => {

    it("should return true for valid polygon", () => {
        assert.isTrue(checkValidity.checkValidity(helpers.square()[0]));
    });
});

describe("checkValidityFalse", () => {

    it("should return false for invalid polygon", () => {
        let square = helpers.square()[0];
        square.pair = null;

        assert.isFalse(checkValidity.checkValidity(square));
    });
});

describe("noClosedNextLoop", () => {

    it("should return false when halfEdges do not form a closed loop following next references", () => {
        let head = new HalfEdge();
        let selfReferentialHalfEdge = new HalfEdge();

        head.next = selfReferentialHalfEdge;
        selfReferentialHalfEdge.next = selfReferentialHalfEdge;

        assert.isFalse(checkValidity.formsNextClosedLoop(head));
    });
});

describe("closedNextLoop", () => {

    it("should return true when halfEdges form a closed loop following next references", () => {
        let head = new HalfEdge();
        let headNextHalfEdge = new HalfEdge();

        head.next = headNextHalfEdge;
        headNextHalfEdge.next = head;

        assert.isTrue(checkValidity.formsNextClosedLoop(head));
    });
});

describe("noClosedPrevLoop", () => {

    it("should return false when halfEdges do not form a closed loop following next references", () => {
        let head = new HalfEdge();
        let selfReferentialHalfEdge = new HalfEdge();

        head.prev = selfReferentialHalfEdge;
        selfReferentialHalfEdge.prev = selfReferentialHalfEdge;

        assert.isFalse(checkValidity.formsPrevClosedLoop(head));
    });
});

describe("closedPrevLoop", () => {

    it("should return true when halfEdges form a closed loop following next references", () => {
        let head = new HalfEdge();
        let headPrevHalfEdge = new HalfEdge();

        head.prev = headPrevHalfEdge;
        headPrevHalfEdge.prev = head;

        assert.isTrue(checkValidity.formsPrevClosedLoop(head));
    });
});

describe("pairsNotDefined", () => {

    it("should return false if any halfEdge does not have a pair defined", () => {
        let head = new HalfEdge();
        let halfEdgeWithNoPair = new HalfEdge();

        head.next = halfEdgeWithNoPair;
        head.pair = halfEdgeWithNoPair;

        assert.isFalse(checkValidity.halfEdgePairsDefined(head));
    });
});

describe("pairsPairNotDefined", () => {

    it("should return false if any halfEdge pair does not have a pair defined", () => {
        let head = new HalfEdge();
        let pairWithNoPair = new HalfEdge();

        head.pair = pairWithNoPair;

        assert.isFalse(checkValidity.halfEdgePairsDefined(head));
    });
});

describe("pairsDefined", () => {

    it("should return true if all half edges have pairs defined", () => {
        let head = new HalfEdge();
        let pair = new HalfEdge();

        head.next = head;
        head.pair = pair;
        pair.next = pair;
        pair.pair = head;

        assert.isTrue(checkValidity.halfEdgePairsDefined(head));
    });
});

describe("selfIntersectingShape", () => {

    it("should return true if a shape is self intersecting", () => {
        let hourGlass = helpers.hourGlass()[0];

        assert.isTrue(checkValidity.selfIntersection(hourGlass, hourGlass));
    });
});

describe("nonSelfIntersectingShape", () => {

    it("should return false if a shape is not self intersecting", () => {
        let square = helpers.square()[0];

        assert.isFalse(checkValidity.selfIntersection(square, square));
    });
});