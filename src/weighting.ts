
import { Pixel } from "./pixel";

export abstract class AbstractWeightingMechanism {
    abstract getWeight(hole: Pixel, boundary: Pixel): number;
}

export class DefaultWeightingMechanism extends AbstractWeightingMechanism {
    private z: number
    private e: number

    public constructor(z: number, e: number) {
        super();
        this.z = z;
        this.e = e;
    }

    getWeight(hole: Pixel, boundary: Pixel): number {
        const dist = Math.hypot(boundary.row - hole.row, boundary.column - hole.column);
        const denominator = Math.pow(dist, this.z) + this.e;
        return 1/denominator;
    }
}
