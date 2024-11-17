import { Program } from './cli';
import { HoleFiller } from './holeFiller';
import { DefaultWeightingMechanism } from './weighting';

// THINGS TO DO
// Make it type safe

async function main() {
    const options = Program.opts();
    console.log(options);
    
    // const dwm = new DefaultWeightingMechanism(3, 0.01);
    // const hf = new HoleFiller(".\\resources\\Lenna.png", ".\\resources\\Mask.png", dwm);
    // const savedImage = await hf.fill();
    // console.log('Filled image saved at: ' + savedImage);
}

main();
