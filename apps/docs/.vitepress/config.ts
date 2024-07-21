import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Responsive Image',
  description: 'Documentation for the Responsive Image project',
  srcDir: './src',
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting started', link: '/getting-started' },
      {
        text: 'Frameworks',
        link: '/frameworks',
      },
      {
        text: 'Build plugins',
        link: '/build',
      },
      {
        text: 'Image CDNs',
        link: '/cdn',
      },
    ],

    sidebar: [
      {
        text: 'Getting started',
        link: '/getting-started',
      },
      {
        text: 'Core concepts',
        link: '/concepts',
      },
      {
        text: 'Frameworks',
        link: '/frameworks',
        items: [{ text: 'Ember', link: '/frameworks/ember' }],
      },
      {
        text: 'Build plugins',
        link: '/build',
        items: [
          { text: 'Vite', link: '/build/vite' },
          { text: 'Webpack', link: '/build/webpack' },
        ],
      },
      {
        text: 'Image CDNs',
        link: '/cdn',
        items: [
          { text: 'Cloudinary', link: '/cdn/cloudinary' },
          { text: 'Imgix', link: '/cdn/imgix' },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/simonihmig/responsive-image',
      },
    ],
  },
});
