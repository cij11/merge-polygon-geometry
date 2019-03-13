const HalfEdge = require('./half-edge');
const Intersection = require('./intersection');
const PolygonIterator = require('./polygon-iterator');

const lineIntersect = require('./line-intersect');
const polygonCreator = require('./polygon-creator');
const validity = require('./check-validity');

/**
 * Function takes two overlapping input polygons, and merges them into a single polygon. The merged polygon is 
 * returned.
 * 
 * Each polygon is assumed to be a "simple polygon" (no self intersecting edges), and is defined by linked half-edges 
 * which form the boundary of that polygon.
 * 
 * @param {Object} polygonA - Polygon to overlap, given as a HalfEdge of the polygon
 * @param {Object} polygonB - Other polygon to overlap, given as a HalfEdge of the polygon
 * 
 * @returns {undefined|null|Object} If no overlap is detected between the input polyons, the function returns a result of null.
 * If there is no overlap, return null. Otherwise, return a HalfEdge of the resulting merged polygon. This will have the same
 * position the HalfEdge given for polygonA.
 */
function mergePolygons(polygonA, polygonB) {
    if (!validity.checkValidity(polygonA) || !validity.checkValidity(polygonB)) {
        return;
    }

    // Algorithm mutates the polygons, so clone the argument polygons first.
    const polyA = polygonCreator.cloneSimplePolygon(polygonA);
    const polyB = polygonCreator.cloneSimplePolygon(polygonB);

    // Merge Algorithm:
    // Find all intersections between edges of polyA and polyB. Intersections store a reference to
    // each HalfEdge involved in the intersection.
    // Split each HalfEdge at its intersection points. i.e, a HalfEdge with two intersections is split
    // into three HalfEdges.
    // For each intersection, update the references of the involved HalfEdges.

    intersections = findPolygonIntersections(polyA, polyB);

    // No intersections means no overlap, or one polygon is fully in the other.
    if (intersections.length === 0) return null; 

    // Sort the intersections by distance from the HalfEdge position.
    sortPolygonIntersections(polyA);
    sortPolygonIntersections(polyB);

    // The split HalfEdges at the intersections, and link the new HalfEdges
    splitPolygonHalfEdgesAtIntersections(polyA, true);
    splitPolygonHalfEdgesAtIntersections(polyB, false);

    // Merge polygons at intersections
    intersections.forEach(
        intersection => mergeIntersection(intersection)
    );

    // return mergedPolygon;
    return polyA;
}

/**
 * Finds the intersections between the edges of polygons polyA and polyB
 * Adds the intersection to each edge's intersection collection, then returns all intersections.
 * @param {Object} polyA - A polygon, given as a HalfEdge of a simple polygon
 * @param {Object} polyB - the other polygon, given as a HalfEdge of a simple polygon
 * 
 * @returns {Array} Array of Intersection objects
 */
function findPolygonIntersections(polyA, polyB) {
    let intersections = [];

    for (let halfEdgeA of new PolygonIterator(polyA)) {
        for (let halfEdgeB of new PolygonIterator(polyB)) {
            const intersectionData = lineIntersect.halfEdgeIntersection(halfEdgeA, halfEdgeB);

            if (intersectionData.intersects === true) {
                intersection = new Intersection(halfEdgeA, halfEdgeB, intersectionData.position)
                halfEdgeA.intersections.push(intersection);
                halfEdgeB.intersections.push(intersection);

                intersections.push(intersection);
            }
        }
    }

    return intersections;
}

/**
 * Sorts all the intersections in every HalfEdge of a polygon in order of descending distance
 * from each HalfEdge's position
 * @param {Object} polygon - a polygon, given as a HalfEdge object
 */
function sortPolygonIntersections(polygon) {
    for (let halfEdge of new PolygonIterator(polygon)) {
        halfEdge.intersections = sortHalfEdgeIntersections(halfEdge.position, halfEdge.intersections);
    }
}

/**
 * Sorts intersections in descending order of distance from position
 * Descending order is chosen so that the stack can be popped in ascending order
 * @param {Object} startPosition - position of the HalfEdge
 * @param {Array} intersections - Intersections on the HalfEdge
 */
function sortHalfEdgeIntersections(startPosition, intersections) {
    return intersections.sort(
        (intersection1, intersection2) => {
            const squaredDistToIntersection1 = intersection1.position.squaredDistance(startPosition);
            const squaredDistToIntersection2 = intersection2.position.squaredDistance(startPosition);

            return squaredDistToIntersection2 - squaredDistToIntersection1;
        }
    )
}

/**
 * Split the HalfEdges of a polygon where it has Intersections with the other polygon
 * @param {Object} polygon - polygon, given as a HalfEdge of the polygon
 * @param {boolean} isPolyA - True if this is polygonA
 */
function splitPolygonHalfEdgesAtIntersections(polygon, isPolyA) {
    for (let halfEdge of new PolygonIterator(polygon)) {
        if (halfEdge.intersections.length > 0) {
            const intersection = halfEdge.intersections.pop();
            splitHalfEdgeAtIntersection(halfEdge, intersection, isPolyA);
        }
    }
}

/**
 * Split HalfEdges at their Intersections. Update connections so that the
 * new HalfEdge is next from the original, and prev from originalHalfEdge.next
 * @param {Object} originalHalfEdge - HalfEdge to be split
 * @param {Object} intersection - Intersection to split at
 * @param {boolean} isPolyA - true if this is polygonA
 */
function splitHalfEdgeAtIntersection(originalHalfEdge, intersection, isPolyA) {
    const newHalfEdge = new HalfEdge();
    const newHalfEdgePair = new HalfEdge();

    newHalfEdge.position = intersection.position;
    newHalfEdgePair.position = intersection.position;

    newHalfEdge.next = originalHalfEdge.next;
    newHalfEdgePair.next = originalHalfEdge.pair.next;

    newHalfEdge.prev = originalHalfEdge;
    newHalfEdgePair.prev = originalHalfEdge.pair;

    newHalfEdge.pair = originalHalfEdge.pair;
    newHalfEdgePair.pair = originalHalfEdge;

    originalHalfEdge.next.prev = newHalfEdge;
    originalHalfEdge.pair.next.prev = newHalfEdgePair;

    // Reassign properties of the originals last, after they have been read
    originalHalfEdge.next = newHalfEdge;
    originalHalfEdge.pair.next = newHalfEdgePair;

    originalHalfEdge.pair.pair = newHalfEdge;
    originalHalfEdge.pair = newHalfEdgePair;

    // Update the appropriate reference in the Intersection, so that the Intersection points
    // to the correct pair of HalfEdges when later resolving the merge
    if (isPolyA) {
        intersection.halfEdgeA = newHalfEdge;
    } else {
        intersection.halfEdgeB = newHalfEdge;
    }

    // Move any remaining intersections to the new HalfEdge
    newHalfEdge.intersections = originalHalfEdge.intersections;
    originalHalfEdge.intersections = [];
}

/**
 * Rewire the HalfEdges around the Intersection correctly, such that the exterior boundary
 * can be followed clockwise, and the interior boundaries can be followed counter-clockwise
 * @param {Object} intersection - Intersection to resolve
 */
function mergeIntersection(intersection) {
    const isClockwise = clockwiseTest(intersection.halfEdgeA.prev.position, intersection.halfEdgeB.prev.position, intersection.position);

    // Rewire the connections. Mapping is based on enumerating the two possible valid intersection types.
    // Possibilities: The turn given by halfEdgeA.prev.position -> intersection -> halfEdgeB.prev.position
    // is either clockwise, or counterclockwise.
    if (isClockwise) {
        intersection.halfEdgeA.prev.next = intersection.halfEdgeB;
        intersection.halfEdgeB.prev.next = intersection.halfEdgeA.prev.pair;
        intersection.halfEdgeA.prev.pair.prev = intersection.halfEdgeB.prev;
        intersection.halfEdgeB.prev.pair.prev = intersection.halfEdgeA.pair;

        intersection.halfEdgeA.pair.next = intersection.halfEdgeB.prev.pair;
        intersection.halfEdgeB.pair.next = intersection.halfEdgeA;

        intersection.halfEdgeB.prev = intersection.halfEdgeA.prev;
        intersection.halfEdgeA.prev = intersection.halfEdgeB.pair;
    } else {
        intersection.halfEdgeA.prev.next = intersection.halfEdgeB.prev.pair;
        intersection.halfEdgeB.prev.next = intersection.halfEdgeA;
        intersection.halfEdgeA.prev.pair.prev = intersection.halfEdgeB.pair;
        intersection.halfEdgeB.prev.pair.prev = intersection.halfEdgeA.prev;

        intersection.halfEdgeA.pair.next = intersection.halfEdgeB;
        intersection.halfEdgeB.pair.next = intersection.halfEdgeA.prev.pair;

        intersection.halfEdgeA.prev = intersection.halfEdgeB.prev;
        intersection.halfEdgeB.prev = intersection.halfEdgeA.pair;
    }
}

/**
 * Determine if the turn from aPos -> intersectPos -> bPos is clockwise
 * @param {Object} aPos - starting position Vector2
 * @param {Object} bPos - ending position Vector2
 * @param {Object} intersectPos - middle position Vector2
 * 
 * @returns {boolean} true if the turn is clockwise
 */
function clockwiseTest(aPos, bPos, intersectPos) {
    return (intersectPos.x - aPos.x) * (bPos.y - aPos.y) - (intersectPos.y - aPos.y) * (bPos.x - aPos.x) < 0;
}

module.exports = mergePolygons;