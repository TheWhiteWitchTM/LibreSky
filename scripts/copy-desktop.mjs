import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const www = path.join(root, 'desktop', 'www');
const files = ['index.html', '404.html', 'manifest.webmanifest', 'robots.txt', 'sitemap.xml', 'client-metadata.json', 'sw.js'];
const dirs = ['css', 'js', 'assets'];

await rm(www, { recursive: true, force: true });
await mkdir(www, { recursive: true });
await Promise.all(files.map((file) => cp(path.join(root, file), path.join(www, file))));
await Promise.all(dirs.map((dir) => cp(path.join(root, dir), path.join(www, dir), { recursive: true })));
console.log(`Copied the site into ${www}`);
