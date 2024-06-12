import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'client/index.ts',
    output: {
        file: 'static/script/client.js',
        format: 'iife',
        sourcemap: 'inline',
    },
    plugins: [
        typescript({ tsconfig: "client/tsconfig.json" }),
        resolve(),
    ]
};
