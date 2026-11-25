import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {buildRobotsTxt, buildSitemapXml} from './src/lib/sitemap';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ and generates static sitemap.xml + robots.txt
      // for static/Cloudflare Workers deployments.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
          if (fs.existsSync(distDir)) {
            const siteUrl = (
              process.env.SITE_URL ||
              'https://finance-tools.sinisa-mitrovic7.workers.dev'
            ).replace(/\/+$/, '');
            fs.writeFileSync(
              path.join(distDir, 'sitemap.xml'),
              buildSitemapXml(siteUrl),
              'utf-8'
            );
            fs.writeFileSync(
              path.join(distDir, 'robots.txt'),
              buildRobotsTxt(siteUrl),
              'utf-8'
            );
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
