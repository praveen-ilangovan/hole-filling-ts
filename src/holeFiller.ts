
import { Image, convert_to_grayscale } from './sharpUtils';
import { Pixel } from './pixel';

export class HoleFiller {
    private imagePath: string
    private maskPath: string
    private connectivity: number

    private image: Image | undefined
    private mask: Image | undefined
    private holes: Set<Pixel> = new Set();
    private boundaries: Set<Pixel> = new Set();
    private neighbours: number[][] = [];

    public constructor(imagePath: string, maskPath: string, connectivity: number = 4) {
        this.imagePath = imagePath;
        this.maskPath = maskPath;
        this.connectivity = connectivity;

        this.neighbours = [[-1,0], [1,0], [0,-1], [0,1]];
        if (this.connectivity == 8) {
            this.neighbours.push([-1,-1]);
            this.neighbours.push([-1,1]);
            this.neighbours.push([1,-1]);
            this.neighbours.push([1,1]);
        }
    }

    public async fill(): Promise<string> {
        this.image = await convert_to_grayscale(this.imagePath);
        this.mask = await convert_to_grayscale(this.maskPath);

        if (!this.image && !this.mask) {
            throw new Error('Failed to read the image and mask');
        }

        this.findHolesAndBoundaries();
        this.setHoleColor();

        const filledImagePath: string = "";
        return filledImagePath;
    }

    private findHolesAndBoundaries(): void {
        if (!this.mask) {
            return
        }

        for (let r=0; r < this.mask.width; r++) {
            for (let c=0; c < this.mask.height; c++) {
                const index = (r*this.mask.width) +c;
                const maskValue = this.mask.data[index];
                if (maskValue < 0.5) {
                    const hole: Pixel = {row: r, column: c, index: index, value: maskValue}
                    this.holes.add(hole);
                    this.findBoundaries(hole);
                }
            }
        }

        console.log(this.holes.size);
        console.log(this.boundaries.size);

    }

    private findBoundaries(hole: Pixel): void {
        if (!this.mask || !this.image) {
            return
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

            let index = (nr*this.mask.width) + nc;
            if (this.mask.data[ index ] >= 0.5) {
                this.boundaries.add({row: nr,
                                     column: nc,
                                     index: index,
                                     value: this.image.data[index]/255
                                    });
            }
        }
    }

    private setHoleColor(): void {
        if (!this.image) {
            return
        }

        for (const hole of this.holes) {
            const color = this.calculateHoleColor(hole);
            this.image.data[hole.index] = color*255;
        }
    }

    private calculateHoleColor(hole: Pixel): number {
        let numerator = 0.0;
        let denominator = 0.0;

        for (const boundary of this.boundaries) {
            const weight = 5;
            numerator += weight * boundary.value;
            denominator += weight;
        }

        return numerator/denominator;
    }
}
