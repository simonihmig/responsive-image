import { cloudinary, imgix, netlify } from '@responsive-image/cdn';
import { ResponsiveImage } from '@responsive-image/solid';
import image from '../images/aurora.jpg?responsive';
import imageLqipColor from '../images/aurora.jpg?lqip=color&responsive';
import imageLqipInline from '../images/aurora.jpg?lqip={"type":"inline","targetPixels":16}&responsive';
import imageLqipBlurhash from '../images/aurora.jpg?lqip={"type":"blurhash","targetPixels":16}&responsive';
import imagePortrait from '../images/aurora.jpg?aspect=2:3&responsive';
import imageGray from '../images/aurora.jpg?grayscale&responsive';

export default function Home() {
  return (
    <main>
      <h2>Netlify</h2>
      <ResponsiveImage
        src={netlify('aurora-original.jpg')}
        data-test-netlify-image
      />
      <h2>Cloudinary</h2>
      <ResponsiveImage
        src={cloudinary('aurora-original_w0sk6h')}
        data-test-cloudinary-image
      />
      <h2>imgix</h2>
      <ResponsiveImage
        src={imgix('aurora-original.jpg')}
        data-test-imgix-image
      />
      <h2>Local</h2>
      <ResponsiveImage src={image} data-test-local-image="responsive" />
      <ResponsiveImage src={image} width={320} data-test-local-image="fixed" />
      <ResponsiveImage
        src={imageLqipColor}
        width={320}
        data-test-local-image="fixed,lqip-color"
      />
      <ResponsiveImage
        src={imageLqipInline}
        width={320}
        data-test-local-image="fixed,lqip-inline"
      />
      <ResponsiveImage
        src={imageLqipBlurhash}
        width={320}
        data-test-local-image="fixed,lqip-blurhash"
      />
      <ResponsiveImage
        src={imageGray}
        width={320}
        data-test-local-image="fixed,grayscale"
      />
      <ResponsiveImage
        src={imagePortrait}
        width={320}
        data-test-local-image="fixed,aspect"
      />
    </main>
  );
}
