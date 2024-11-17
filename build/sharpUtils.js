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
function saveImage(image_1) {
    return __awaiter(this, arguments, void 0, function* (image, filepath = ".\\resources\\filledImaage.png") {
        const width = image.width;
        const height = image.height;
        const channels = image.channels;
        const ext = "png";
        yield sharp(image.data, { raw: { width, height, channels } })
            .toFormat(ext)
            .toFile(filepath);
    });
}
