/**
 * Main entry point for the image processing application.
 */
import { Program } from './cli';
import { HoleFiller } from './holeFiller';
import { DefaultWeightingMechanism } from './weighting';

async function main() {

    /**
     * Parse command line arguments and retrieve input options.
     */
    const options = Program.opts();

    /**
     * Create an instance of the weighting mechanism using the provided options.
     *
     * @type {DefaultWeightingMechanism}
     */
    const dwm = new DefaultWeightingMechanism(options.weight_z, options.weight_e);

    /**
     * Create a new instance of the HoleFiller class.
     *
     * @type {HoleFiller}
     */
    const hf = new HoleFiller(options.imagePath,
                              options.maskPath,
                              dwm,
                              Number.parseInt(options.connectivity));

    /**
     * Execute the fill algorithm and save the output.
     *
     * @type {string} filledImagePath - The path to the filled image.
     */
    const savedImage = await hf.fill();

    console.log('Filled image saved at: ' + savedImage);
}

main();
