import Controller from '@ember/controller';
import dogImage from '../images/docs/dog.jpg?responsive';
import dogImageLqipColor from '../images/docs/dog.jpg?lqip=color&responsive';
import dogImageLqipInline from '../images/docs/dog.jpg?lqip={"type":"inline","targetPixels":16}&responsive';
import dogImageLqipBlurhash from '../images/docs/dog.jpg?lqip={"type":"blurhash","targetPixels":16}&responsive';

export default class IndexController extends Controller {
  dogImage = dogImage;
  dogImageLqipColor = dogImageLqipColor;
  dogImageLqipInline = dogImageLqipInline;
  dogImageLqipBlurhash = dogImageLqipBlurhash;
}
