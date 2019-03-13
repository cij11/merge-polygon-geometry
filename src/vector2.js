/**
 * Class representing a 2d Vector
 */
class Vector2 {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Finds the squared distance between this and another Vector2
     * @param {Object} otherPosition - Vector2 to find the squared distance too
     * 
     * @returns {number} The squared distance to the other Vector2
     */
    squaredDistance(otherPosition) {
        let xDist = this.x - otherPosition.x;
        let yDist = this.y - otherPosition.y;

        return xDist * xDist + yDist * yDist;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

}

module.exports = Vector2;