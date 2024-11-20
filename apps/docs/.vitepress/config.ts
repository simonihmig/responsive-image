import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ResponsiveImage',
  description: 'Documentation for the Responsive Image project',
  srcDir: './src',
  cleanUrls: true,
  appearance: 'dark',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Usage', link: '/usage/concepts' },
      {
        text: 'Frameworks',
        link: '/frameworks/',
      },
      {
        text: 'Build plugins',
        link: '/build/',
      },
      {
        text: 'Image CDNs',
        link: '/cdn/',
      },

      {
        text: 'About',
        // link: '/usage/concepts',
        items: [
          {
            text: 'Releases',
            link: 'https://github.com/simonihmig/responsive-image/releases',
          },
          {
            text: 'Me',
            link: '/me',
          },
          {
            text: 'History',
            link: '/history',
          },
          {
            text: 'Credits',
            link: '/credits',
          },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Getting started',
        link: '/getting-started',
      },
      {
        text: 'Usage',
        base: '/usage',
        // link: '/usage/concepts',
        items: [
          {
            text: 'Core concepts',
            link: '/concepts',
          },
          {
            text: 'Image component',
            link: '/component',
          },
          {
            text: 'Local images',
            link: '/local-images',
          },
          {
            text: 'Remote images',
            link: '/remote-images',
          },
          {
            text: 'Image formats',
            link: '/image-formats',
          },
          {
            text: 'LQIP',
            link: '/lqip',
          },
        ],
      },
      {
        text: 'Frameworks',
        link: '/',
        base: '/frameworks',
        items: [
          { text: 'Ember', link: '/ember' },
          { text: 'Web Component (Lit)', link: '/wc' },
        ],
      },
      {
        text: 'Build plugins',
        link: '/',
        base: '/build',
        items: [
          { text: 'Vite', link: '/vite' },
          { text: 'Webpack', link: '/webpack' },
        ],
      },
      {
        text: 'Image CDNs',
        link: '/',
        base: '/cdn',
        items: [
          { text: 'Cloudinary', link: '/cloudinary' },
          { text: 'Imgix', link: '/imgix' },
          { text: 'Netlify', link: '/netlify' },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/simonihmig/responsive-image',
      },
    ],

    footer: {
      message: 'Made with ❤︎ for OSS - Support 🇺🇦',
      copyright:
        'Copyright © 2024 <a href="https://github.com/simonihmig">Simon Ihmig</a>',
    },
  },
});
