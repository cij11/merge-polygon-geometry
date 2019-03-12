/**
 * Function takes two overlapping input polygons, and merges them into a single polygon. The merged polygon is 
 * returned.
 * 
 * Each polygon is assumed to be a "simple polygons" (no self intersecting edges), and is defined by linked half-edges 
 * which form the boundary of that polygon.
 * 
 * If no overlap is detected between the input polyons, the function returns a result of null.
 * 
 * @param {*} polygonA 
 * @param {*} polygonB 
 */
function mergePolygons(polygonA, polygonB) {

    if(typeof polygonA !== 'HalfEdge' || typeof polygonB !== 'HalfEdge') {
        return;
    }

    // Your solution

    // return mergedPolygon;
}

module.exports = mergePolygons;