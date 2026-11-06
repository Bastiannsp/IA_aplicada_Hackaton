import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ciudadanía Clara', short_name: 'Ciudadanía', start_url: '/', display: 'standalone',
    background_color: '#F5F6F8', theme_color: '#0B3D91',
    icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  };
}
