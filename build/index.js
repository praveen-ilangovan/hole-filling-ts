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
const sharp = require('sharp');
// Reads the image, converts it to grayscale.
function convert_to_grayscale(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const buffer = yield sharp(path)
            .grayscale()
            .raw()
            .toBuffer({ resolveWithObject: true });
        return buffer;
    });
}
function get_weight(x0, y0, x1, y1) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const denominator = Math.pow(dist, 3) + 0.01;
    return 1 / denominator;
}
function processImage(imagePath, maskPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield convert_to_grayscale(imagePath);
        const mask = yield convert_to_grayscale(maskPath);
        const width = image.info.width;
        const height = image.info.height;
        const channels = image.info.channels;
        const filled_image = Object.assign({}, image);
        // Apply the mask!!
        let holes = [];
        for (let r = 0; r < width; r++) {
            for (let c = 0; c < height; c++) {
                const index = (r * width) + c;
                const maskValue = mask.data[index];
                if (maskValue < 0.5) {
                    filled_image.data[index] = 200; // debug
                    holes.push([r, c, index]);
                }
            }
        }
        // console.log(holes);
        // Find the boundaries
        const boundaries = new Set();
        const neighbours = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (let hole of holes) {
            for (let neighbour of neighbours) {
                const nr = hole[0] + neighbour[0];
                if (nr < 0 || nr >= width) {
                    continue;
                }
                const nc = hole[1] + neighbour[1];
                if (nc < 0 || nc >= height) {
                    continue;
                }
                if (mask.data[(nr * width) + nc] >= 0.5) {
                    // filled_image.data[ (nr*width) + nc ] = 0; //debug
                    boundaries.add([nr, nc, filled_image.data[(nr * width) + nc] / 255, (nr * width) + nc]);
                }
            }
        }
        console.log(boundaries.size);
        // Calculate the hole color
        for (let hole of holes) {
            let numerator = 0.0;
            let denominator = 0.0;
            for (let boundary of boundaries) {
                const weight = get_weight(hole[0], hole[1], boundary[0], boundary[1]);
                numerator += weight * boundary[2];
                denominator += weight;
            }
            filled_image.data[hole[2]] = (numerator / denominator) * 255;
        }
        // debug
        for (let boundary of boundaries) {
            filled_image.data[boundary[3]] = 0;
        }
        // Write out the image
        yield sharp(filled_image.data, { raw: { width, height, channels } })
            .toFormat('png')
            .toFile('.\\resources\\nature_filled.png');
    });
}
console.log("Hello World!");
// processImage(".\\resources\\nature.png", ".\\resources\\nature_mask.png");
processImage(".\\resources\\Lenna.png", ".\\resources\\Mask.png");
