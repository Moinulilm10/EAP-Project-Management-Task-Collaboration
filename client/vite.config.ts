import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import nextJest from 'next/jest.js';

const createNextConfig = nextJest({
    dir: './',
});


import path from 'path';

const config = defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './setupTests.ts',
    },
});

export default createNextConfig(config);