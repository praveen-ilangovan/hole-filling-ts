"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoleFiller = void 0;
const path = require('path');
const sharpUtils_1 = require("./sharpUtils");
/**
 * Class that fills holes in an image using a mask and a specified weighting mechanism.
 *
 * @class HoleFiller
 */
class HoleFiller {
    /**
     * Constructs an instance of HoleFiller.
     *
     * @param {string} imagePath - The file path to the image.
     * @param {string} maskPath - The file path to the mask.
     * @param {AbstractWeightingMechanism} weightingMechanism - The weighting mechanism used to calculate weights between pixels.
     * @param {number} [connectivity=4] - The connectivity type (4 or 8).
     */
    constructor(imagePath, maskPath, weightingMechanism, connectivity = 4) {
        this.holes = new Set();
        this.boundaries = new Set();
        this.neighbours = [];
        this.imagePath = imagePath;
        this.maskPath = maskPath;
        this.weightingMechanism = weightingMechanism;
        this.connectivity = connectivity;
        this.neighbours = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        if (this.connectivity == 8) {
            this.neighbours.push([-1, -1]);
            this.neighbours.push([-1, 1]);
            this.neighbours.push([1, -1]);
            this.neighbours.push([1, 1]);
        }
    }
    /**
     * Fills the holes in the image and saves the result to a new file.
     *
     * @returns {Promise<string>} The file path of the filled image.
     * @throws Will throw an error if the image or mask cannot be read.
     */
    fill() {
        return __awaiter(this, void 0, void 0, function* () {
            this.image = yield (0, sharpUtils_1.convertToGrayscale)(this.imagePath);
            this.mask = yield (0, sharpUtils_1.convertToGrayscale)(this.maskPath);
            if (!this.image && !this.mask) {
                throw new Error('Failed to read the image and mask');
            }
            const dirPath = path.dirname(this.image.path);
            const ext = path.extname(this.image.path);
            const filename = 'filledImage_' + Date.now() + ext;
            const filledImagePath = path.join(dirPath, filename);
            this.findHolesAndBoundaries();
            this.setHoleColor();
            (0, sharpUtils_1.saveImage)(this.image, filledImagePath);
            return filledImagePath;
        });
    }
    /**
     * Finds holes and boundary pixels in the image using the mask.
     *
     * @private
     */
    findHolesAndBoundaries() {
        if (!this.mask) {
            return;
        }
        for (let r = 0; r < this.mask.width; r++) {
            for (let c = 0; c < this.mask.height; c++) {
                const index = (r * this.mask.width) + c;
                const maskValue = this.mask.data[index];
                if (maskValue < 0.5) {
                    const hole = { row: r, column: c, index: index, value: maskValue };
                    this.holes.add(hole);
                    this.findBoundaries(hole);
                }
            }
        }
    }
    /**
     * Identifies the boundary pixels adjacent to a given hole pixel.
     *
     * @private
     * @param {Pixel} hole - The hole pixel to check for boundaries.
     */
    findBoundaries(hole) {
        if (!this.mask || !this.image) {
            return;
        }
        for (const neighbour of this.neighbours) {
            const nr = hole.row + neighbour[0];
            if (nr < 0 || nr >= this.mask.width) {
                continue;
            }
            const nc = hole.column + neighbour[1];
            if (nc < 0 || nc >= this.mask.height) {
                continue;
            }
            let index = (nr * this.mask.width) + nc;
            if (this.mask.data[index] >= 0.5) {
                this.boundaries.add({ row: nr,
                    column: nc,
                    index: index,
                    value: this.image.data[index] / 255
                });
            }
        }
    }
    /**
     * Sets the color of the pixels in the holes based on boundary weights.
     *
     * @private
     */
    setHoleColor() {
        if (!this.image) {
            return;
        }
        for (const hole of this.holes) {
            const color = this.calculateHoleColor(hole);
            this.image.data[hole.index] = color * 255;
        }
    }
    /**
     * Calculates the color for a given hole pixel based on surrounding boundary pixels.
     *
     * @private
     * @param {Pixel} hole - The hole pixel for which the color is being calculated.
     * @returns {number} The calculated color value.
     */
    calculateHoleColor(hole) {
        let numerator = 0.0;
        let denominator = 0.0;
        for (const boundary of this.boundaries) {
            const weight = this.weightingMechanism.getWeight(hole, boundary);
            numerator += weight * boundary.value;
            denominator += weight;
        }
        return numerator / denominator;
    }
}
exports.HoleFiller = HoleFiller;
