"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultWeightingMechanism = exports.AbstractWeightingMechanism = void 0;
class AbstractWeightingMechanism {
}
exports.AbstractWeightingMechanism = AbstractWeightingMechanism;
class DefaultWeightingMechanism extends AbstractWeightingMechanism {
    constructor(z, e) {
        super();
        this.z = z;
        this.e = e;
    }
    getWeight(hole, boundary) {
        const dist = Math.hypot(boundary.row - hole.row, boundary.column - hole.column);
        const denominator = Math.pow(dist, this.z) + this.e;
        return 1 / denominator;
    }
}
exports.DefaultWeightingMechanism = DefaultWeightingMechanism;
