const sharp = require('sharp')

export interface Image {
    data: Buffer;
    width: number;
    height: number;
    channels: number;
    path: string
}

export async function convert_to_grayscale(path: string): Promise<Image> {
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

// save image (data: object, width: number, height: number, channels: number, format: string, dst: string)
