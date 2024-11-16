const sharp = require('sharp')

// Reads the image, converts it to grayscale.
async function convert_to_grayscale(path: string) {
    const buffer = await sharp(path)
                            .grayscale()
                            .raw()
                            .toBuffer({ resolveWithObject: true });
    return buffer;
}

async function processImage(imagePath: string, maskPath: string) {
    const image = await convert_to_grayscale(imagePath);
    const mask = await convert_to_grayscale(maskPath);
    const width = image.info.width;
    const height = image.info.height;
    const channels = image.info.channels;

    const filled_image = { ...image };

    // Apply the mask!!
    let holes = [];
    for (let r=0; r < width; r++) {
        for (let c=0; c < height; c++) {
            const index = (r*width) +c;
            const maskValue = mask.data[index];
            if (maskValue < 0.5) {
                filled_image.data[index] = 200; // debug
                holes.push( [r, c, index] ); 
            }
        }
    }
    // console.log(holes);

    // Find the boundaries
    const boundaries = new Set();
    const neighbours = [[-1,0], [1,0], [0,-1], [0,1]];
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

            if (mask.data[ (nr*width) + nc ] >= 0.5) {
                filled_image.data[ (nr*width) + nc ] = 0;
                boundaries.add([nr, nc, filled_image.data[ (nr*width) + nc ]]);
            }
        }
    }

    console.log(boundaries.size);

    // Write out the image
    await sharp(filled_image.data, { raw: { width, height, channels } })
            .toFormat('png')
            .toFile('.\\resources\\nature_filled.png');
}

function test() {
    let arr = [ [1,1,1,1,1],
                [1,1,0,1,1],
                [1,1,0,1,1],
                [1,1,1,1,1],
                [1,1,1,1,1] ];

    let holes = [];
    for (let i=0; i<arr.length; i++) {
        for (let j=0; j<arr[i].length; j++) {
            if (arr[i][j] === 0) {
                holes.push([i,j]);
            }
        }
    }

    console.log(holes);

    let boundaries = new Set();
    const neighbours = [[-1,0], [1,0], [0,-1], [0,1]];
    for (let hole of holes) {
        for (let neighbour of neighbours) {
            const nr = hole[0] + neighbour[0];
            if (nr < 0 || nr >= arr.length) {
                continue;
            }

            const nc = hole[1] + neighbour[1];
            if (nc < 0 || nc >= arr[0].length) {
                continue;
            }

            if (arr[nr][nc] != 0) {
                boundaries.add([nr, nc, arr[nr][nc]]);
            }
        }
    }

    console.log(boundaries);

}

console.log("Hello World!");
processImage(".\\resources\\nature.png", ".\\resources\\nature_mask.png");
// test();
