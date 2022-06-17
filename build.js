// @ts-check
import { build } from 'esbuild';
import { exit, argv } from 'node:process';
import { resolve } from 'node:path';
import { writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dirname = resolve(fileURLToPath(import.meta.url), '..'),
  srcDir = resolve(dirname, 'src'),
  distDir = resolve(dirname, 'dist'),
  release = argv.includes('--dist');

/** @type {import('esbuild').BuildOptions} */
const buildConfig = {
  entryPoints: [resolve(srcDir, 'index.js')],
  bundle: true,
  outfile: resolve(distDir, 'index.js'),
  allowOverwrite: true,
  minify: release,
  minifyIdentifiers: release,
  minifySyntax: release,
  minifyWhitespace: release,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  metafile: false,
  legalComments: 'none',
  sourcemap: release ? false : 'inline',
  banner: {
    js: 'import{createRequire}from "module";const require=createRequire(import.meta.url);',
  },
};

const distPackageJson = {
  private: true,
  type: 'module',
};

try{
  const start = Date.now();
  await mkdir(resolve(buildConfig.outfile, '..'), { recursive: true });
  await Promise.all([
    build(buildConfig),
    writeFile(resolve(distDir, 'package.json'), JSON.stringify(distPackageJson)),
    copyFile(resolve(srcDir, 'grpc.proto'), resolve(distDir, 'grpc.proto')),
  ]);
  console.log(
    `Built for production with esbuild in ${Date.now() - start} ms`,
  );
} catch(e){
  exit(1);
}
