import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  transpilePackages: ['@buscapro/ui', '@buscapro/types'],
  // Remove console.* (exceto error) no bundle de produção.
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ['lucide-react', '@buscapro/ui'],
  },
};

export default nextConfig;
