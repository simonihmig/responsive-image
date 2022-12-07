import Controller from '@ember/controller';
// @ts-expect-error todo how to make TS understand this?
import dogImage from '../images/docs/dog.jpg';
// @ts-expect-error todo how to make TS understand this?
import dogImageLqipColor from '../images/docs/dog.jpg?lqip=color';
// @ts-expect-error todo how to make TS understand this?
import dogImageLqipInline from '../images/docs/dog.jpg?lqip={"type":"inline","targetPixels":16}';
// @ts-expect-error todo how to make TS understand this?
import dogImageLqipBlurhash from '../images/docs/dog.jpg?lqip={"type":"blurhash","targetPixels":16}';

export default class IndexController extends Controller {
  dogImage = dogImage;
  dogImageLqipColor = dogImageLqipColor;
  dogImageLqipInline = dogImageLqipInline;
  dogImageLqipBlurhash = dogImageLqipBlurhash;
}

export const raw = true;
