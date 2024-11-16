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
        for (let r = 0; r < image.info.width; r++) {
            for (let c = 0; c < image.info.height; c++) {
                const index = (r * width) + c;
                const maskValue = mask.data[index];
                if (maskValue < 0.5) {
                    filled_image.data[index] = 0;
                }
            }
        }
        // let pixels = [];
        // for (let r=0; r < image.info.width; r++) {
        //     let row = []
        //     for (let c=0; c < image.info.height; c++) {
        //         const maskValue = mask.data[r+c]/255.0;
        //         if (maskValue < 0.5) {
        //             row.push(0.0);
        //         } else {
        //             row.push(image.data[r+c]/255.0);
        //         }
        //     }
        //     pixels.push(row)
        // }
        // const data = buffer.data;
        // const info = buffer.info;
        // console.log(data.length);
        // console.log(info);
        // let pixels = [];
        // for (let r=0; r < info.width; r++) {
        //     let row = []
        //     for (let c=0; c < info.height; c++) {
        //         row.push(data[r+c]/255.0);
        //     }
        //     pixels.push(row)
        // }
        // console.log(pixels);
        yield sharp(filled_image.data, { raw: { width, height, channels } })
            .toFormat('png')
            .toFile('.\\resources\\nature_filled.png');
    });
}
console.log("Hello World!");
processImage(".\\resources\\nature.png", ".\\resources\\nature_mask.png");
