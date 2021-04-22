/* eslint-disable import/no-extraneous-dependencies */

import path from 'path';

import reactRefresh from '@vitejs/plugin-react-refresh';
import { Alias, defineConfig } from 'vite';

import * as tsconfig from './tsconfig.paths.json';

function readAliasFromTsConfig(): Alias[] {
  const pathReplaceRegex = new RegExp(/\/\*$/, '');
  return Object.entries(tsconfig.compilerOptions.paths).reduce((aliases, [fromPaths, toPaths]) => {
    const find = fromPaths.replace(pathReplaceRegex, '');
    const toPath = toPaths[0].replace(pathReplaceRegex, '');
    const replacement = path.resolve(__dirname, toPath);
    aliases.push({ find, replacement });
    return aliases;
  }, [] as Alias[]);
}

export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: readAliasFromTsConfig(),
  },
  css: { modules: { localsConvention: 'camelCase' } },
  server: {
    proxy: {
      '/hliu/liu-uni.js': 'https://boshiamy.com',
    },
  },
  build: {
    outDir: 'build',
  },
});
