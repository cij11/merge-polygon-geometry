const HalfEdge = require('./half-edge');
const PolygonIterator = require('./polygon-iterator');

/**
 * Helper function to build a polygon defined by connected half-edges from
 * an ordered array of polygon coordinates
 * 
 * @param {Array} coordinates - Array of Vector2 objects, defining a simple polygon in clockwise order
 */
function buildPolygon(coordinates) {
    const length = coordinates.length;

    return coordinates.map((position, i, positions) => {
        
        const next = positions[(i + 1) % length];

        const halfEdge = new HalfEdge();
        const halfPair = new HalfEdge();
        
        halfEdge.pair = halfPair;
        halfPair.pair = halfEdge;

        halfEdge.position = position;
        halfPair.position = next;

        return halfEdge;        
    })
    .map((halfEdge, i, halfEdges) => {
        
        const next = halfEdges[(i + 1) % length];

        halfEdge.next = next;
        halfEdge.next.pair.next = halfEdge.pair;

        return halfEdge;
    })
    .map((halfEdge, i, halfEdges) => {
        const prevIndex = (((i - 1) % length) + length) % length;
        const prev = halfEdges[prevIndex];

        halfEdge.prev = prev;
        halfEdge.prev.pair.prev = halfEdge.pair;

        return halfEdge;
    });
};

/**
 * Clones a polygon. Clones all HalfEdges and Vectors. Does not clone intersections
 * 
 * @param {Object} polygon - Polygon, given as one HalfEdge of the polygon
 * 
 * @returns {Object} A HalfEdge of the cloned polygon
 */
function cloneSimplePolygon(polygon) {
    let vertices = [];

    for (let halfEdge of new PolygonIterator(polygon)) {
        vertices.push(halfEdge.position.clone());
    }

    return buildPolygon(vertices)[0];
}

module.exports = {
    buildPolygon,
    cloneSimplePolygon,
};