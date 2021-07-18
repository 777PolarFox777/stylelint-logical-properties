import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
	input: 'src/index.js',
	output: [
		{ file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true },
		{ file: 'dist/index.es.mjs', format: 'es', sourcemap: true }
	],
  external: [/@babel\/runtime/, 'stylelint'],
	plugins: [
    nodeResolve(),
    commonjs(),
		babel({
      babelHelpers: 'runtime',
			presets: ['@babel/env'],
      plugins: ['@babel/plugin-transform-runtime'],
      exclude: ["node_modules"],
		}),
    json(),
	]
};
