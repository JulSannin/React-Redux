import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
	...fsd.configs.recommended,
	{
		// одна страница и один виджет: каждый срез по построению используется один раз
		rules: {
			'fsd/insignificant-slice': 'off',
		},
	},
	{
		// у шрифтов, иконок и scss-переменных нет осмысленного TS-API
		files: ['./src/shared/assets/**', './src/shared/styles/**'],
		rules: {
			'fsd/public-api': 'off',
			'fsd/segments-by-purpose': 'off',
		},
	},
]);
