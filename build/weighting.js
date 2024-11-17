"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultWeightingMechanism = exports.AbstractWeightingMechanism = void 0;
/**
 * An abstract class representing a mechanism to calculate the weight between two pixels.
 *
 * @abstract
 * @class AbstractWeightingMechanism
 */
class AbstractWeightingMechanism {
}
exports.AbstractWeightingMechanism = AbstractWeightingMechanism;
/**
 * A default implementation of the AbstractWeightingMechanism that calculates weights using
 * a formula based on the Euclidean distance and provided parameters.
 *
 * @class DefaultWeightingMechanism
 * @extends {AbstractWeightingMechanism}
 */
class DefaultWeightingMechanism extends AbstractWeightingMechanism {
    /**
     * Creates an instance of DefaultWeightingMechanism.
     *
     * @param {number} z - The exponent used in the weight calculation formula.
     * @param {number} e - A small positive value added to the denominator to prevent division by zero.
     */
    constructor(z, e) {
        super();
        this.z = z;
        this.e = e;
    }
    /**
     * Calculates the weight between a hole pixel and a boundary pixel using the formula:
     * `1 / (dist^z + e)` where `dist` is the Euclidean distance between the two pixels.
     *
     * @param {Pixel} hole - The pixel in the hole region.
     * @param {Pixel} boundary - The pixel on the boundary.
     * @returns {number} The calculated weight.
     */
    getWeight(hole, boundary) {
        const dist = Math.hypot(boundary.row - hole.row, boundary.column - hole.column);
        const denominator = Math.pow(dist, this.z) + this.e;
        return 1 / denominator;
    }
}
exports.DefaultWeightingMechanism = DefaultWeightingMechanism;
