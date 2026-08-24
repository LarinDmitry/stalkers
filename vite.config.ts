import path from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {exportType: 'default', ref: true, svgo: false, titleProp: true},
      include: '**/*.svg',
    }),
    viteTsconfigPaths(),
    react({
      babel: {
        plugins: [['babel-plugin-styled-components']],
      },
    }),
    checker({typescript: true}),
  ],
  base: '/stalkers',
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, 'src/assets'),
      components: path.resolve(__dirname, 'src/components'),
      pages: path.resolve(__dirname, 'src/pages'),
      services: path.resolve(__dirname, 'src/services'),
      theme: path.resolve(__dirname, 'src/theme'),
      store: path.resolve(__dirname, 'src/store'),
      stories: path.resolve(__dirname, 'src/stories'),
    },
  },
});
