import type { NextConfig } from "next";

const nextConfig: NextConfig = {
      output: 'standalone',
      
      async rewrites() {
            return [
                  {
                        source: '/api/rms/:path*',
                        destination: 'http://192.168.0.36:8087/api/rms/:path*',
                  },
            ];
      },
};

export default nextConfig;
