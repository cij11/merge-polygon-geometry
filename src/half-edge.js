const Vector2 = require('./vector2');

/**
 * Adapt and extend the HalfEdge class as needed to complete the excersise.
 * 
 * Further information on the half edge data structure:
 * https://en.wikipedia.org/wiki/Doubly_connected_edge_list
 */
class HalfEdge {

    constructor() {
        
        this.next = null;
        this.pair = null;

        this.position = new Vector2();
    }
}

module.exports = HalfEdge;