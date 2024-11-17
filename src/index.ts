import { HoleFiller } from './holeFiller';
import { DefaultWeightingMechanism } from './weighting';

// THINGS TO DO
// Make it type safe
// CLI

async function main() {
    const dwm = new DefaultWeightingMechanism(3, 0.01);
    const hf = new HoleFiller(".\\resources\\Lenna.png", ".\\resources\\Mask.png", dwm);
    const savedImage = await hf.fill();
    console.log('Filled image saved at: ' + savedImage);
}

main();
