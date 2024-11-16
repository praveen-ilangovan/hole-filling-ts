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
                    filled_image.data[index] = 0;
                    holes.push([(r * width), c]);
                }
            }
        }
        console.log(holes.length);
        // Write out the image
        yield sharp(filled_image.data, { raw: { width, height, channels } })
            .toFormat('png')
            .toFile('.\\resources\\nature_filled.png');
    });
}
console.log("Hello World!");
processImage(".\\resources\\nature.png", ".\\resources\\nature_mask.png");
