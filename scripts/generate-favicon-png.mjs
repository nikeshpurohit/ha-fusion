import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const svg = readFileSync(resolve(root, 'static/favicon.svg'), 'utf8');

// resvg doesn't evaluate CSS media queries, so inline the dark-mode colours
// before rendering: house light-grey on the app's dark background.
const svgDark = svg
	.replace(/\.house \{ fill: #1e2228; \}/, '.house { fill: #e2e8f0; }')
	.replace(/@media \(prefers-color-scheme: dark\) \{[\s\S]*?\}/, '');

const resvg = new Resvg(svgDark, {
	fitTo: { mode: 'width', value: 512 },
	background: '#1e2228'
});

const png = resvg.render().asPng();
writeFileSync(resolve(root, 'static/favicon.png'), png);
console.log('favicon.png written (512x512)');
