import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const electron = path.join(root, 'node_modules', '.bin', 'electron');
if (!fs.existsSync(electron)) {
  console.error('FAIL electron is not installed. Run npm install.');
  process.exit(1);
}

const data = fs.mkdtempSync(path.join(os.tmpdir(), 'libreoffice-window-'));
const child = spawn(electron, [root], {
  cwd: root,
  env: {
    ...process.env,
    LIBREOFFICE_SMOKE: '1',
    LIBREOFFICE_DATA: data,
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let output = '';
const timer = setTimeout(() => {
  console.error(output);
  console.error('FAIL window smoke timed out');
  child.kill('SIGTERM');
  process.exit(1);
}, 60000);

child.stdout.on('data', (chunk) => {
  output += chunk.toString();
  process.stdout.write(chunk);
});
child.stderr.on('data', (chunk) => {
  output += chunk.toString();
  process.stderr.write(chunk);
});

child.on('close', (code) => {
  clearTimeout(timer);
  const ok = output.includes('"app":true')
    && output.includes('"feed":true')
    && output.includes('"splashHidden":true')
    && output.includes('"office":true');
  if (code === 0 && ok) {
    console.log('window smoke ok');
    process.exit(0);
  }
  console.error(`FAIL window smoke exit ${code}`);
  process.exit(1);
});
