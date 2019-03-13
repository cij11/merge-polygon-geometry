/**
 * Wraps a polygon defined by linked HalfEdges, to provide iteration over the polygon.
 * Iteration terminates when the cycle gets back to the head, with the last iteration
 * returning the HalfEdge prev to the head.
 */
class PolygonIterator {
    constructor(halfEdge, iterateForward = true) {
        this.head = halfEdge;
        this.iterateForward = iterateForward;
    }

    /**
     * Iteratively return each HalfEdge in the polygon
     * 
     * @generator
     * @yields {Object} the next HalfEdge in the polygon
     */
    *values() {
        let current = this.head;

        do {
            yield current;
            current = this.iterateForward
                ? current.next
                : current.prev;
        }
        while (current !== this.head);
    }

    [Symbol.iterator]() {
        return this.values();
    }
}

module.exports = PolygonIterator;