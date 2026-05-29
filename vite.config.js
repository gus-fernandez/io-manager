import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5174,
        strictPort: true,
        proxy: {
            '/password': 'http://localhost',
            '/api':      'http://localhost',
            '/sanctum':  'http://localhost',
            '/email':    'http://localhost',
            '/logout':   'http://localhost',
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
});