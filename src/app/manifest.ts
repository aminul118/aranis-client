import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Aranis',
    short_name: 'Aranis',
    description:
      'The Aranis - Discover curated collections of luxury apparel blending modern design with timeless elegance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#021D2E',
    theme_color: '#021D2E',
    categories: ['shopping', 'lifestyle', 'clothing'],
    lang: 'en',
    orientation: 'portrait',
    scope: '/',
    id: '/?source=pwa',
    prefer_related_applications: false,
    display_override: ['window-controls-overlay'],
    protocol_handlers: [
      {
        protocol: 'mailto',
        url: '/email?to=%s',
      },
      {
        protocol: 'tel',
        url: '/call?number=%s',
      },
    ],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      // desktop view
      {
        src: '/assets/screenshots/desktop-view.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      // mobile view
      {
        src: '/assets/screenshots/mobile-view.png',
        sizes: '360x640',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],
  };
}
