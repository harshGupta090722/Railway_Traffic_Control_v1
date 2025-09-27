/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'prod.spline.design',
      'app.spline.design', 
      'localhost'
    ],
    unoptimized: true // For demo deployment
  },
  webpack: (config) => {
    // Handle canvas for 3D rendering
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Optimize for demo performance
  swcMinify: true,
  compress: true,
  // Enable static optimization  
  trailingSlash: false,
  // Handle 3D assets
  assetPrefix: process.env.NODE_ENV === 'production' ? '/sih-train-control' : '',
}

module.exports = nextConfig