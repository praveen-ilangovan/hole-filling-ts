const sharp = require('sharp')

/**
 * Represents an image with its data and metadata.
 * 
 * @interface Image
 * @property {Buffer} data - The raw pixel data of the image.
 * @property {number} width - The width of the image in pixels.
 * @property {number} height - The height of the image in pixels.
 * @property {number} channels - The number of color channels in the image (e.g., 1 for grayscale, 3 for RGB).
 * @property {string} path - The file path of the original image.
 */
export interface Image {
    data: Buffer;
    width: number;
    height: number;
    channels: number;
    path: string
}

/**
 * Converts an image to grayscale and returns an Image object with the processed data.
 * 
 * @param {string} path - The file path to the input image.
 * @returns {Promise<Image>} A promise that resolves to an Image object containing the grayscale image data and metadata.
 * @throws Will throw an error if the image processing fails.
 */
export async function convertToGrayscale(path: string): Promise<Image> {
    const buffer = await sharp(path)
                            .grayscale()
                            .raw()
                            .toBuffer({ resolveWithObject: true });
    
    const image: Image = {data: buffer.data,
                          width: buffer.info.width,
                          height: buffer.info.height,
                          channels: buffer.info.channels,
                          path: path
    };

    return image;
}

/**
 * Saves an Image object to a specified file path.
 * 
 * @param {Image} image - The Image object to save.
 * @param {string} filepath - The file path where the image should be saved, including the extension.
 * @returns {Promise<void>} A promise that resolves when the image has been saved.
 * @throws Will throw an error if the image saving fails.
 */
export async function saveImage(image: Image, filepath: string) {
    const width = image.width
    const height = image.height
    const channels = image.channels
    const ext = filepath.split('.').pop();

    await sharp(image.data, { raw: { width, height, channels } })
            .toFormat(ext)
            .toFile(filepath);
}
