import Controller from '@ember/controller';
import dogImage from '../images/aurora.jpg?responsive';
import dogImageLqipColor from '../images/aurora.jpg?lqip=color&responsive';
import dogImageLqipInline from '../images/aurora.jpg?lqip={"type":"inline","targetPixels":16}&responsive';
import dogImageLqipBlurhash from '../images/aurora.jpg?lqip={"type":"blurhash","targetPixels":16}&responsive';

export default class IndexController extends Controller {
  dogImage = dogImage;
  dogImageLqipColor = dogImageLqipColor;
  dogImageLqipInline = dogImageLqipInline;
  dogImageLqipBlurhash = dogImageLqipBlurhash;
}
