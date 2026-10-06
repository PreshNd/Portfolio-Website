// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pcndigwe.site',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !page.includes('/system') })],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
