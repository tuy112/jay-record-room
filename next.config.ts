import type { NextConfig } from "next";

const nextConfig: NextConfig = {
      output: 'standalone',
      
      async rewrites() {
            return [
                  {
                        source: '/api/:path*',
                        destination: 'http://192.168.0.37:8087/api/:path*',
                  },
            ];
      },
};

export default nextConfig;
