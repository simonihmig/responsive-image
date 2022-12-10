import Controller from '@ember/controller';
import testImage from 'test-app/images/tests/image.jpg?widths=50,100,640&formats=original,webp,avif&responsive';
import testImageLqipInline from 'test-app/images/tests/image.jpg?lqip=inline&widths=50,100,640&responsive';
import testImageLqipColor from 'test-app/images/tests/image.jpg?lqip=color&widths=50,100,640&responsive';
import testImageLqipBlurhash from 'test-app/images/tests/image.jpg?lqip=blurhash&widths=50,100,640&responsive';

export default class IndexController extends Controller {
  testImage = testImage;
  testImageLqipInline = testImageLqipInline;
  testImageLqipColor = testImageLqipColor;
  testImageLqipBlurhash = testImageLqipBlurhash;
}

export const raw = true;
