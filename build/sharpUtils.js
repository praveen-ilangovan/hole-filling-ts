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
exports.convertToGrayscale = convertToGrayscale;
exports.saveImage = saveImage;
const sharp = require('sharp');
/**
 * Converts an image to grayscale and returns an Image object with the processed data.
 *
 * @param {string} path - The file path to the input image.
 * @returns {Promise<Image>} A promise that resolves to an Image object containing the grayscale image data and metadata.
 * @throws Will throw an error if the image processing fails.
 */
function convertToGrayscale(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const buffer = yield sharp(path)
            .grayscale()
            .raw()
            .toBuffer({ resolveWithObject: true });
        const image = { data: buffer.data,
            width: buffer.info.width,
            height: buffer.info.height,
            channels: buffer.info.channels,
            path: path
        };
        return image;
    });
}
/**
 * Saves an Image object to a specified file path.
 *
 * @param {Image} image - The Image object to save.
 * @param {string} filepath - The file path where the image should be saved, including the extension.
 * @returns {Promise<void>} A promise that resolves when the image has been saved.
 * @throws Will throw an error if the image saving fails.
 */
function saveImage(image, filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        const width = image.width;
        const height = image.height;
        const channels = image.channels;
        const ext = filepath.split('.').pop();
        yield sharp(image.data, { raw: { width, height, channels } })
            .toFormat(ext)
            .toFile(filepath);
    });
}
