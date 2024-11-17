import { Program } from './cli';
import { HoleFiller } from './holeFiller';
import { DefaultWeightingMechanism } from './weighting';

async function main() {
    const options = Program.opts();    
    const dwm = new DefaultWeightingMechanism(options.weight_z, options.weight_e);
    const hf = new HoleFiller(options.imagePath,
                              options.maskPath,
                              dwm,
                              Number.parseInt(options.connectivity));
    const savedImage = await hf.fill();
    console.log('Filled image saved at: ' + savedImage);
}

main();
