const { build } = require('esbuild');

build({
  entryPoints: ['learning-experience.jsx'],
  outfile: 'learning.bundle.js',
  bundle: true,
  minify: true,
  format: 'iife',
  jsx: 'automatic',
  target: ['es2020'],
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'eof'
}).catch(() => process.exit(1));
