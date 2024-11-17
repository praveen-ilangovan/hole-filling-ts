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
const cli_1 = require("./cli");
const holeFiller_1 = require("./holeFiller");
const weighting_1 = require("./weighting");
// THINGS TO DO
// Make it type safe
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = cli_1.Program.opts();
        console.log(options);
        const dwm = new weighting_1.DefaultWeightingMechanism(options.weight_z, options.weight_e);
        const hf = new holeFiller_1.HoleFiller(options.imagePath, options.maskPath, dwm, Number.parseInt(options.connectivity));
        const savedImage = yield hf.fill();
        console.log('Filled image saved at: ' + savedImage);
    });
}
main();
