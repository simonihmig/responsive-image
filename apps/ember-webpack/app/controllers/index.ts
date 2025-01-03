import Controller from '@ember/controller';
import image from '../images/aurora.jpg?responsive';
import imageLqipColor from '../images/aurora.jpg?lqip=color&responsive';
import imageLqipInline from '../images/aurora.jpg?lqip={"type":"inline","targetPixels":16}&responsive';
import imageLqipBlurhash from '../images/aurora.jpg?lqip={"type":"blurhash","targetPixels":16}&responsive';
import imageLqipThumbhash from '../images/aurora.jpg?lqip={"type":"thumbhash"}&responsive';
import imagePortrait from '../images/aurora.jpg?aspect=2:3&responsive';
import imageGray from '../images/aurora.jpg?grayscale&responsive';

export default class IndexController extends Controller {
  image = image;
  imageLqipColor = imageLqipColor;
  imageLqipInline = imageLqipInline;
  imageLqipBlurhash = imageLqipBlurhash;
  imageLqipThumbhash = imageLqipThumbhash;
  imagePortrait = imagePortrait;
  imageGray = imageGray;
}
