const Vector2 = require('../src/vector2');

const polygonCreator = require('../src/polygon-creator');

const buildPolygon = polygonCreator.buildPolygon;

/**
 * Predefined polygon coordinate sets.
 */
const triangle = [
    new Vector2(-0.5,-0.5),
    new Vector2(0,0.5),
    new Vector2(0.5,-0.5),
];

const square = [
    new Vector2(-0.45,-0.45),
    new Vector2(-0.45,0.45),
    new Vector2(0.45,0.45),
    new Vector2(0.45,-0.45),
];

const overlappingSquare = [
    new Vector2(-0.25,-0.25),
    new Vector2(-0.25,0.65),
    new Vector2(0.65,0.65),
    new Vector2(0.65,-0.25),
];

const nonOverlappingSquare = [
    new Vector2(10,10),
    new Vector2(10,11),
    new Vector2(11,11),
    new Vector2(11,10),
]

const horizontalRectangle = [
    new Vector2(-0.6,-0.2),
    new Vector2(-0.6,0.2),
    new Vector2(0.6,0.2),
    new Vector2(0.6,-0.2),
]

// Complex, self intersecting shape
const hourGlass = [
    new Vector2(-0.45,-0.45),
    new Vector2(0.45,0.45),
    new Vector2(-0.45,0.45),
    new Vector2(0.45,-0.45),
];

// Concave boundary
const chevron = [
    new Vector2(-0.5,-0.5),
    new Vector2(0,0.5),
    new Vector2(0.5,-0.5),
    new Vector2(0, 0.25)
]

/**
 * 
 * @param {Object} halfEdge - HalfEdge of the polygon
 * @param {number} n - Number of references to follow. If positive, follow next references
 * If negative, follow prev references
 */
function getHalfEdgeByIndex(halfEdge, n) {
    let nthHalfEdge = halfEdge;
    if (n >= 0) {
        for (let i = 0; i < n; i++) {
            nthHalfEdge = nthHalfEdge.next
        }
    } else {
        for (let i = 0; i < -n; i++) {
            nthHalfEdge = nthHalfEdge.prev;
        }
    }

    return nthHalfEdge;
}

module.exports = {
    triangle : () => buildPolygon(triangle),
    square : () => buildPolygon(square),
    overlappingSquare : () => buildPolygon(overlappingSquare),
    nonOverlappingSquare : () => buildPolygon(nonOverlappingSquare),
    horizontalRectangle: () => buildPolygon(horizontalRectangle),
    hourGlass: () => buildPolygon(hourGlass),
    chevron: () => buildPolygon(chevron),
    getHalfEdgeByIndex,
};