/**
 * Represents a pixel in a 2D image grid.
 * 
 * @interface Pixel
 * @property {number} row - The row position of the pixel in the image grid.
 * @property {number} column - The column position of the pixel in the image grid.
 * @property {number} index - The linear index of the pixel (e.g., for 1D array representation).
 * @property {number} value - The grayscale value of the pixel (e.g., 0-255 or 0-1).
 */
export interface Pixel {
    readonly row: number;
    readonly column: number;
    readonly index: number;
    readonly value: number;
}
