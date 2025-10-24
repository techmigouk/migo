/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Optimize production builds
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  // Reduce initial load
  modularizeImports: {
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/{{member}}',
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },
}

export default nextConfig
