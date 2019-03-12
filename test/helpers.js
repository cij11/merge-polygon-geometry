const HalfEdge = require('../src/half-edge');
const Vector2 = require('../src/vector2');

/**
 * Predefined polygon coordinate sets. Adapt and extend as needed to complete the excersise
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

/**
 * Helper function to build a polygon defined by connected half-edges from
 * an ordered array of polygon coordinates
 * 
 * @param {*} coordinates 
 */
function buildPolygon(coordinates) {

    return coordinates.map((position, i, positions) => {
        
        const next = positions[(i + 1) % positions.length];

        const halfEdge = new HalfEdge();
        const halfPair = new HalfEdge();
        
        halfEdge.pair = halfPair;
        halfPair.pair = halfEdge;

        halfEdge.position = position;
        halfPair.position = next;

        return halfEdge;        
    })
    .map((halfEdge, i, halfEdges) => {
        
        const next = halfEdges[(i + 1) % halfEdges.length];

        halfEdge.next = next;
        halfEdge.next.pair.next = halfEdge.pair

        return halfEdge;
    });
};

module.exports = {
    triangle : buildPolygon(triangle),
    square : buildPolygon(square),
};