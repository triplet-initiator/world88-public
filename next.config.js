const path = require('path');

/** @type {import('next').NextConfig} */
// module.exports = {
//   // experimental: {
//   //   outputStandalone: true,
//   // },
//   output: 'standalone',
//   reactStrictMode: true,
//   images: {
//     domains: ['wildtech-asset.s3.ap-southeast-1.amazonaws.com', 'dummyimage.com'],
//     formats: ['image/avif', 'image/webp'],
//   },
//   sassOptions: {
//     includePaths: [path.join(__dirname, 'styles')],
//     prependData: `@import '@/styles/_variables.scss';`,
//   },
// };

//next.config.js
const withImages = require('next-images');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: [
      'wildtech-asset.s3.ap-southeast-1.amazonaws.com',
      'dummyimage.com',
      'img.wildtech.io',
    ],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.wildtech.io',
        port: '',
        pathname: '/provider-web-logo/',
      },
    ],
  },
  transpilePackages: ['antd-mobile'],
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import '@/styles/_variables.scss';`,
  },
};

module.exports = withImages(nextConfig);
