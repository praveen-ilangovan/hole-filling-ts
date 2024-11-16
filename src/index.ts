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


    for (let r=0; r < image.info.width; r++) {
        for (let c=0; c < image.info.height; c++) {
            const index = (r*width) +c;
            const maskValue = mask.data[index];
            if (maskValue < 0.5) {
                filled_image.data[index] = 0;
            }
        }
    }

    await sharp(filled_image.data, { raw: { width, height, channels } })
    .toFormat('png')
    .toFile('.\\resources\\nature_filled.png')
}

console.log("Hello World!");
processImage(".\\resources\\nature.png", ".\\resources\\nature_mask.png");
