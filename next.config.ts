import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Configuración de seguridad
  poweredByHeader: false, // Ocultar header X-Powered-By

  // Ignorar errores de ESLint y TypeScript durante el build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Headers de seguridad adicionales
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Download-Options',
            value: 'noopen'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://www.google.com https://maps.google.com;"
          }
        ]
      }
    ];
  },

  // Configuración de compilación
  reactStrictMode: true,
  
  // Optimizaciones de seguridad
  compress: true,
};

export default nextConfig;
