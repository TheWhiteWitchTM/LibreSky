import * as esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

await esbuild.build({
  absWorkingDir: root,
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  outdir: 'dist',
  legalComments: 'none',
  sourcemap: false,
  logLevel: 'info',
  entryPoints: { index: 'src/index.ts' },
  plugins: [{
    name: 'libbluesky',
    setup(build) {
      build.onResolve({ filter: /\/libbluesky\/dist\/index\.js$/ }, () => ({
        path: '../../libbluesky/dist/index.js',
        external: true,
      }));
    },
  }],
});
