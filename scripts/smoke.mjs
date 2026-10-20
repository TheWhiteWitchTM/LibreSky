import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fileFromAppUrl } from '../src/paths.js';
import { DEFAULTS } from '../src/services/store.js';
import { installSteps, pickModels } from '../src/shared/ollama.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;

function check(name, condition) {
  if (condition) console.log(`ok  ${name}`);
  else {
    failed += 1;
    console.error(`FAIL ${name}`);
  }
}

check('theme starts black', DEFAULTS.theme === 'black');
const picked = pickModels(['qwen3.5:4b', 'writer:latest', 'coder:latest']);
check('picks writer for chat', picked.chatModel === 'writer:latest');
check('falls back to qwen', pickModels(['qwen3.5:4b']).chatModel === 'qwen3.5:4b');
check('install steps name writer', installSteps('/tmp/ai').includes('/tmp/ai/writer.Modelfile'));

const index = fileFromAppUrl('office://app/index.html', root);
check('serves index.html', index === path.join(root, 'index.html'));
const appJs = fileFromAppUrl('office://app/js/app.js', root);
check('serves js/app.js', appJs === path.join(root, 'js', 'app.js'));
check('rejects the app root', fileFromAppUrl('office://app/', root) === null);
check('rejects a directory', fileFromAppUrl('office://app/js', root) === null);
check('blocks other hosts', fileFromAppUrl('office://other/index.html', root) === null);
check('blocks missing files', fileFromAppUrl('office://app/no-such-file.html', root) === null);

if (failed) {
  console.error(`${failed} failed`);
  process.exit(1);
}
console.log('unit smoke ok');
