import { isServer } from 'solid-js/web';
import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';
import { ResponsiveImage } from '../src';
import { type ImageData } from '@responsive-image/core';

describe('environment', () => {
  test('runs on client', () => {
    expect(typeof window).toBe('object');
    expect(isServer).toBe(false);
  });
});

describe('ResponsiveImage', () => {
  const defaultImageData: ImageData = {
    imageTypes: ['jpeg', 'webp', 'avif'],
    imageUrlFor(width, type = 'jpeg') {
      return `/provider/w${width}/image.${type}`;
    },
  };

  describe('basics', () => {
    test('it renders a source for every format', async () => {
      const { container } = render(() => (
        <ResponsiveImage src={defaultImageData} />
      ));

      // TODO: check testing-library best practices
      expect(container.querySelector('picture')).toBeInTheDocument();
      // expect(container.querySelectorAll('source')).to.have.length(3);
      // expect(
      //   container.querySelector('source[type="image/jpeg"]'),
      // ).toBeInTheDocument();
      // expect(
      //   container.querySelector('source[type="image/webp"]'),
      // ).toBeInTheDocument();
      // expect(
      //   container.querySelector('source[type="image/avif"]'),
      // ).toBeInTheDocument();
    });

    // it('renders a hello component', () => {
    //   createRoot(() => {
    //     const container = (<Hello />) as HTMLDivElement;
    //     expect(container.outerHTML).toBe('<div>Hello World!</div>');
    //   });
    // });

    // it('changes the hello target', () =>
    //   createRoot((dispose) => {
    //     const [to, setTo] = createSignal('Solid');
    //     const container = (<Hello to={to()} />) as HTMLDivElement;
    //     expect(container.outerHTML).toBe('<div>Hello Solid!</div>');
    //     setTo('Tests');

    //     // rendering is async
    //     queueMicrotask(() => {
    //       expect(container.outerHTML).toBe('<div>Hello Tests!</div>');
    //       dispose();
    //     });
    //   }));
  });
});
