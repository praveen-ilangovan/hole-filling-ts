const sharp = require('sharp')

export interface Image {
    data: Buffer;
    width: number;
    height: number;
    channels: number;
    path: string
}

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

export async function saveImage(image: Image, filepath: string = ".\\resources\\filledImaage.png") {
    const width = image.width
    const height = image.height
    const channels = image.channels
    const ext = "png";

    await sharp(image.data, { raw: { width, height, channels } })
            .toFormat(ext)
            .toFile(filepath);
}
