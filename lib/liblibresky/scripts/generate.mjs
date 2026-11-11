import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  ['linksDoc', 'lexicons/app/libresky/actor/links.json'],
  ['highlightDoc', 'lexicons/app/libresky/feed/highlight.json'],
  ['articleDoc', 'lexicons/app/libresky/article/article.json'],
  ['presenceDoc', 'lexicons/app/libresky/actor/presence.json'],
];

const parts = [];
for (const [name, file] of files) {
  const json = JSON.parse(await readFile(path.join(root, file), 'utf8'));
  if (json.lexicon !== 1 || typeof json.id !== 'string' || !json.defs) {
    throw new Error(`Bad lexicon file: ${file}`);
  }
  parts.push(`export const ${name} = ${JSON.stringify(json)} as const;\n`);
}

const outDir = path.join(root, 'src', 'generated');
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, 'docs.ts'), `${parts.join('\n')}`);
