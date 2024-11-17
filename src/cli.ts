import { Command, Option } from 'commander';

// CLI
export const Program = new Command();
Program
  .version("1.0.0")
  .description("An image processing library to fill a region in an image")
  .requiredOption('-i --imagePath <imagePath>', 'File path of the image to be filled.')
  .requiredOption('-m --maskPath <maskPath>', 'File path of the mask to be applied.')
  .requiredOption('-z --weight_z <z>', 'z value for the default weighting mechanism.')
  .requiredOption('-e --weight_e <e>', 'e value for the default weighting mechanism.')
  .addOption(new Option('-c, --connectivity <connectivity>', 'Pixel connectivity.').choices(['4', '8']))
  .parse(process.argv);
