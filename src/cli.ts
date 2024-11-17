/**
 * CLI program configuration for an image processing tool that fills a region in an image.
 */
import { Command, Option } from 'commander';

/**
 * Main CLI command configuration.
 *
 * @constant {Command} Program - The main program command instance.
 */
export const Program = new Command();
Program
  .version("1.0.0")
  .description("An image processing library to fill a region in an image")

  /**
   * @option {string} -i --imagePath <imagePath> - The file path of the image to be filled.
   */
  .requiredOption('-i --imagePath <imagePath>', 'File path of the image to be filled.')

  /**
   * @option {string} -m --maskPath <maskPath> - The file path of the mask to be applied.
   */
  .requiredOption('-m --maskPath <maskPath>', 'File path of the mask to be applied.')

  /**
   * @option {number} -z --weight_z <z> - The exponent used in the weight calculation formula.
   * @parseInt Parses the input as an integer.
   */
  .requiredOption('-z --weight_z <z>', 'The exponent used in the weight calculation formula.', parseInt)

  /**
   * @option {number} -e --weight_e <e> - A small positive value added to the weight calculation formula to prevent division by zero.
   * @parseFloat Parses the input as a floating-point number.
   */
  .requiredOption('-e --weight_e <e>', 'A small positive value added to the weight calculation formula to prevent division by zero.', parseFloat)

  /**
   * @option {string} -c, --connectivity <connectivity> - Pixel connectivity, with a default of '4' and choices of '4' or '8'.
   */
  .addOption(new Option('-c, --connectivity <connectivity>', 'Pixel connectivity.').default('4').choices(['4', '8']))

  .parse(process.argv);
