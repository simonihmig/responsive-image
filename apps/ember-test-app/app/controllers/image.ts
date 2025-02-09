import Controller from '@ember/controller';
import testImage from 'ember-test-app/images/aurora.jpg?widths=50,100,640&formats=original,webp,avif&responsive';
import testImageLqipInline from 'ember-test-app/images/aurora.jpg?lqip=inline&widths=50,100,640&responsive';
import testImageLqipColor from 'ember-test-app/images/aurora.jpg?lqip=color&widths=50,100,640&responsive';
import testImageLqipBlurhash from 'ember-test-app/images/aurora.jpg?lqip=blurhash&widths=50,100,640&responsive';
import testImageLqipThumbhash from 'ember-test-app/images/aurora.jpg?lqip=thumbhash&widths=50,100,640&responsive';

export default class IndexController extends Controller {
  testImage = testImage;
  testImageLqipInline = testImageLqipInline;
  testImageLqipColor = testImageLqipColor;
  testImageLqipBlurhash = testImageLqipBlurhash;
  testImageLqipThumbhash = testImageLqipThumbhash;
}

export const raw = true;
