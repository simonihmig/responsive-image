import Controller from '@ember/controller';
// @ts-expect-error todo how to make TS understand this?
import dogImage from '../images/docs/dog.jpg';
// @ts-expect-error todo how to make TS understand this?
import dogImageLqipColor from '../images/docs/dog.jpg?lqip=color';

export default class IndexController extends Controller {
  dogImage = dogImage;
  dogImageLqipColor = dogImageLqipColor;
}

export const raw = true;
