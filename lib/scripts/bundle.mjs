import * as esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const shared = {
  absWorkingDir: root,
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  outdir: 'lib/dist',
  legalComments: 'none',
  sourcemap: false,
  logLevel: 'info',
};

await esbuild.build({
  ...shared,
  entryPoints: { index: 'lib/src/index.ts' },
});

// The class bundle imports ProtocolError, ValidationError, and jsonOf from the
// runtime bundle so both files share one class identity.
await esbuild.build({
  ...shared,
  entryPoints: { lexicons: 'lib/src/lexicons.ts' },
  plugins: [{
    name: 'share-runtime',
    setup(build) {
      build.onResolve({ filter: /^(?:\.\.\/)+(?:errors|data\/json)\.js$/ }, () => ({
        path: './index.js',
        external: true,
      }));
    },
  }],
});
