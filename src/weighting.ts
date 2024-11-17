
import { Pixel } from "./pixel";

/**
 * An abstract class representing a mechanism to calculate the weight between two pixels.
 * 
 * @abstract
 * @class AbstractWeightingMechanism
 */
export abstract class AbstractWeightingMechanism {
    /**
     * Calculates the weight between a hole pixel and a boundary pixel.
     * 
     * @abstract
     * @param {Pixel} hole - The pixel in the hole region.
     * @param {Pixel} boundary - The pixel on the boundary.
     * @returns {number} The calculated weight.
     */
    abstract getWeight(hole: Pixel, boundary: Pixel): number;
}

/**
 * A default implementation of the AbstractWeightingMechanism that calculates weights using
 * a formula based on the Euclidean distance and provided parameters.
 * 
 * @class DefaultWeightingMechanism
 * @extends {AbstractWeightingMechanism}
 */
export class DefaultWeightingMechanism extends AbstractWeightingMechanism {
    private z: number // Exponent for distance in the denominator
    private e: number // Small value to avoid division by zero

    /**
     * Creates an instance of DefaultWeightingMechanism.
     * 
     * @param {number} z - The exponent used in the weight calculation formula.
     * @param {number} e - A small positive value added to the denominator to prevent division by zero.
     */
    public constructor(z: number, e: number) {
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
    getWeight(hole: Pixel, boundary: Pixel): number {
        const dist = Math.hypot(boundary.row - hole.row, boundary.column - hole.column);
        const denominator = Math.pow(dist, this.z) + this.e;
        return 1/denominator;
    }
}
