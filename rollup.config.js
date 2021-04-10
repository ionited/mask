import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [{
    input: './src/masks/default.ts',
    output: [{
        file:'./dist/masks/default.esm.js',
        format: 'esm',
        sourcemap: true
    }, {
        file: './dist/masks/default.js',
        format: 'umd',
        name: 'window',
        sourcemap: true,
        extend: true
    }],
    plugins: [
        typescript(),
        terser(),
        cleaner({ targets: ['./core', './dist', './masks'] })
    ]
}, {
    input: './src/masks/number.ts',
    output: [{
        file:'./dist/masks/number.esm.js',
        format: 'esm',
        sourcemap: true
    }, {
        file: './dist/masks/number.js',
        format: 'umd',
        name: 'window',
        sourcemap: true,
        extend: true
    }],
    plugins: [
        typescript(),
        terser()
    ]
}, {
    input: './src/core.ts',
    output: [{
        file:'./dist/core.esm.js',
        format: 'esm',
        sourcemap: true
    }, {
        file: './dist/core.js',
        format: 'umd',
        name: 'window',
        sourcemap: true,
        extend: true
    }],
    plugins: [
        typescript(),
        terser(),
        copy({
            targets: [
                { src: './dist/masks', dest: './' }
            ]
        })
    ]
}, {
    input: './src/mask.ts',
    output: [{
        file: pkg.module,
        format: 'esm',
        sourcemap: true
    }, {
        file: pkg.main,
        format: 'umd',
        name: 'window',
        sourcemap: true,
        extend: true
    }],
    plugins: [
        typescript(),
        terser(),
        cleaner({
            targets: [
                './dist/masks/masks',
                './dist/masks/core.d.ts',
                './dist/masks/mask.d.ts',
                './masks/masks'
            ]
        }),
        copy({
            targets: [
                {
                    src: './dist/core**',
                    dest: './core',
                    rename: (name, extension) => `${name.replace('core', 'index')}.${extension}` 
                }
            ]
        })
    ]
}]
