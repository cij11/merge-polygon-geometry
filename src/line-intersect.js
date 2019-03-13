const Vector2 = require('./vector2');

/**
 * Detect intersections between two HalfEdges. The line segment of a HalfEdge is defined by its position, and
 * the position of its next HalfEdge
 * @param {Object} halfEdge1 - One of the HalfEdges to check for intersection
 * @param {Object} halfEdge2 - The other HalfEdge to check for intersection
 * 
 * @returns {Object} with fields position and intersects. If the HalfEdges intersect, intersect is true
 * and position is a Vector2. Otherwise, intersect is false and position is null.
 */
function halfEdgeIntersection(halfEdge1, halfEdge2) {
    return lineSegmentIntersection(halfEdge1.position, halfEdge1.next.position, halfEdge2.position, halfEdge2.next.position);
}

/** 
 * This line segment intersection method was based on http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
 * Detects intersections between line segments
 * @param {Object} lineAStart - Vector2 position of the start of a line
 * @param {Object} lineAEnd - Vector2 position of the end of a line
 * @param {Object} lineBStart - Vector2 position of the start of the other line
 * @param {Object} lineBEnd - Vector2 position of the end of the other line
 * 
 * @returns {Object} with fields position and intersects. If the lines intersect, intersect is true
 * and position is a Vector2. Otherwise, intersect is false and position is null.
 * 
 */
function lineSegmentIntersection(lineAStart, lineAEnd, lineBStart, lineBEnd) {
    // if the lines intersect, the result contains the point of intersection, 
    // and bool 'intersects' set to true.
    let denominator, a, b, numerator1, numerator2, x = 0, y = 0,
        onLineA = false, onLineB = false,
        result = {
            position: null,
            intersects: false,
        };

    denominator = ((lineBEnd.y - lineBStart.y) * (lineAEnd.x - lineAStart.x)) - ((lineBEnd.x - lineBStart.x) * (lineAEnd.y - lineAStart.y));
    if (denominator === 0) {
        return result;
    }
    a = lineAStart.y - lineBStart.y;
    b = lineAStart.x - lineBStart.x;
    numerator1 = ((lineBEnd.x - lineBStart.x) * a) - ((lineBEnd.y - lineBStart.y) * b);
    numerator2 = ((lineAEnd.x - lineAStart.x) * a) - ((lineAEnd.y - lineAStart.y) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    x = lineAStart.x + (a * (lineAEnd.x - lineAStart.x));
    y = lineAStart.y + (a * (lineAEnd.y - lineAStart.y));

    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        onLineA = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        onLineB = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    result.intersects = onLineA === true && onLineB === true;
    if (result.intersects) result.position = new Vector2(x, y);

    return result;
};

module.exports = {
    lineSegmentIntersection,
    halfEdgeIntersection,
}