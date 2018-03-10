import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';

export default {
    input: './src/index.js',
    plugins: [
        eslint(),
        babel({
            babelrc: false,
            presets: ["es2015-rollup"]
        }),
        nodeResolve({
            jsnext: true,
            main: true
        }),
        commonjs()
    ],
    output: {
        name: 'soucouyant',
        format: 'umd',
        file: './dist/soucouyant.umd.js',
        sourcemap: true
    }
};