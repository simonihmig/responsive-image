import Service from '@ember/service';
import { config } from '../config.ts';

const screenWidth = typeof screen !== 'undefined' ? screen.width : 320;

export default class ResponsiveImageService extends Service {
  /**
   * the screen's width
   * This is the base value to calculate the image size.
   * That means the {{#crossLink "Services/ResponsiveImage:getImageBySize"}}getImageBySize{{/crossLink}} will return
   * an image that's close to `screenWidth *  window.devicePixelRatio * size / 100`
   */
  screenWidth = screenWidth;

  /**
   * the physical width
   */
  physicalWidth = this.screenWidth * ((window && window.devicePixelRatio) || 1);

  deviceWidths = config.deviceWidths;

  /**
   *
   * @param size
   * @private
   */
  public getDestinationWidthBySize(size: number): number {
    const physicalWidth = this.physicalWidth;
    const factor = (size || 100) / 100;

    return physicalWidth * factor;
  }
}
