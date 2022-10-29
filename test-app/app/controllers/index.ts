import Controller from '@ember/controller';
// @ts-expect-error todo how to make TS understand this?
import dogImage from '../images/docs/dog.jpg';

export default class IndexController extends Controller {
  dogImage = dogImage;
}

export const raw = true;
