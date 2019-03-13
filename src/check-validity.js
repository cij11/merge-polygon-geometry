const HalfEdge = require('./half-edge');
const PolygonIterator = require('./polygon-iterator');

const lineIntersect = require('./line-intersect');

/**
 * Check if the object is a HalfEdge of a polygon, and that polygon is both validly connected 
 * and geometrically a 'simple polygon'
 *
 * @param {Object} polygon - The object to check for validity
 * 
 * @returns {boolean} true if the object is a HalfEdge of a polygon that is valid and simple
 */
function checkValidity(polygon) {
    if(!(polygon instanceof HalfEdge)) {
        return false;
    }

    // Check for a valid loop first, because rely on loop being valid 
    // for terminating iteration over polygon.
    if (!formsNextClosedLoop(polygon)) {
        return false;
    }

    if (!formsPrevClosedLoop(polygon)) {
        return false;
    }

    if (!halfEdgePairsDefined(polygon)) {
        return false;
    }

    if (selfIntersection(polygon, polygon)) {
        return false;
    }

    return true;
}

function formsNextClosedLoop(polygon) {
    const visitedHalfEdges = [];

    for (let halfEdge of new PolygonIterator(polygon)) {
        if (visitedHalfEdges.includes(halfEdge)) {
            return false;
        }
        visitedHalfEdges.push(halfEdge);
        if (!(halfEdge.next instanceof HalfEdge)) {
            return false;
        }
    }

    return true;
}


function formsPrevClosedLoop(polygon) {
    const visitedHalfEdges = [];

    for (let halfEdge of new PolygonIterator(polygon, false)) {
        if (visitedHalfEdges.includes(halfEdge)) {
            return false;
        }
        visitedHalfEdges.push(halfEdge);
        if (!(halfEdge.prev instanceof HalfEdge)) {
            return false;
        }
    }
    return true;
}

function halfEdgePairsDefined(polygon) {
    for (let halfEdge of new PolygonIterator(polygon)) {
        if (!(halfEdge.pair instanceof HalfEdge)) {
            return false;
        }
        if (!(halfEdge.pair.pair instanceof HalfEdge)) {
            return false;
        }
        if (halfEdge.pair.pair !== halfEdge) {
            return false;
        }
    }

    return true;
}

function selfIntersection(polygon, head) {
    let halfEdge = polygon;
    let checkingAgainst = halfEdge.next;

    // Check against all edges from the current, terminating at the head
    do  {
        intersectionData = lineIntersect.halfEdgeIntersection(halfEdge, checkingAgainst);
        if (intersectionData.intersects === true) {
            return true;
        }
        checkingAgainst = checkingAgainst.next;
    }
    while(checkingAgainst !== head)

    // Step the current halfEdge forward one and call recursively, 
    // until the current reaches the head.
    if (halfEdge.next !== head) {
        selfIntersection(halfEdge.next, head);
    }
    return false;
}

module.exports = {
    checkValidity,
    formsNextClosedLoop,
    formsPrevClosedLoop,
    halfEdgePairsDefined,
    selfIntersection,
};