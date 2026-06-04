import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import nextJest from 'next/jest.js';

const createNextConfig = nextJest({
    dir: './',
});


const config = defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './setupTests.ts',
    },
});

export default createNextConfig(config);