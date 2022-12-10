import Controller from '@ember/controller';
// @ts-expect-error TS does not understand this
import testImage from 'test-app/images/tests/image.jpg?widths=50,100,640&formats=original,webp,avif';
// @ts-expect-error TS does not understand this
import testImageLqipInline from 'test-app/images/tests/image.jpg?lqip=inline&widths=50,100,640';
// @ts-expect-error TS does not understand this
import testImageLqipColor from 'test-app/images/tests/image.jpg?lqip=color&widths=50,100,640';
// @ts-expect-error TS does not understand this
import testImageLqipBlurhash from 'test-app/images/tests/image.jpg?lqip=blurhash&widths=50,100,640';

export default class IndexController extends Controller {
  testImage = testImage;
  testImageLqipInline = testImageLqipInline;
  testImageLqipColor = testImageLqipColor;
  testImageLqipBlurhash = testImageLqipBlurhash;
}

export const raw = true;
