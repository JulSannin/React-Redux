/// <reference types="vite-plugin-svgr/client" />

import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), svgr()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: { api: 'modern' },
		},
	},
});
