import { spawn } from 'node:child_process';
import { createReadStream, createWriteStream } from 'node:fs';
import { createRequire } from 'node:module';
import { access, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const desktop = path.join(root, 'desktop');
const out = path.join(root, 'download', 'build');
const download = path.join(root, 'download');
const targets = [
  ['linux', 'x64', 'LibreSky-linux-x64', 'LibreSky-linux-x64.zip'],
  ['win32', 'x64', 'LibreSky-win32-x64', 'LibreSky-windows-x64.zip'],
  ['darwin', 'x64', 'LibreSky-darwin-x64', 'LibreSky-mac-x64.zip'],
];

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited ${code}`));
    });
  });
}

async function icons() {
  try {
    const png2icons = createRequire(path.join(desktop, 'package.json'))('png2icons');
    const input = await readFile(path.join(root, 'assets', 'icon-512.png'));
    const ico = png2icons.createICO(input, png2icons.BILINEAR, 0, false);
    const icns = png2icons.createICNS(input, png2icons.BILINEAR, 0);
    if (ico) await writeFile(path.join(desktop, 'icon.ico'), ico);
    if (icns) await writeFile(path.join(desktop, 'icon.icns'), icns);
    await writeFile(path.join(desktop, 'icon.png'), input);
    return true;
  } catch (error) {
    console.warn(`App icon was skipped: ${error.message}`);
    return false;
  }
}

const keepPak = new Set(['en-US.pak', 'en-GB.pak']);
const keepLproj = new Set(['en.lproj', 'en_GB.lproj', 'Base.lproj']);
const dropFile = new Set(['dxcompiler.dll', 'dxil.dll']);
// Stay under GitHub's 50 MB warning and its 100 MB hard block.
const partBytes = 48_000_000;

async function prunePack(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    if (entry.isSymbolicLink()) return;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.endsWith('.lproj') && !keepLproj.has(entry.name)) {
        await rm(full, { recursive: true, force: true });
        return;
      }
      if (entry.name === 'locales') {
        const files = await readdir(full);
        await Promise.all(files.filter((file) => !keepPak.has(file)).map((file) => rm(path.join(full, file), { force: true })));
        return;
      }
      await prunePack(full);
      return;
    }
    if (dropFile.has(entry.name) || entry.name.endsWith('.pdb')) await rm(full, { force: true });
  }));
}

async function clearParts() {
  const names = await readdir(download);
  await Promise.all(names
    .filter((name) => name === 'manifest.json' || /\.zip\.\d+$/.test(name))
    .map((name) => rm(path.join(download, name), { force: true })));
}

async function splitZip(zipPath) {
  const name = path.basename(zipPath);
  const size = (await stat(zipPath)).size;
  const parts = [];
  let offset = 0;
  let index = 1;
  while (offset < size) {
    const length = Math.min(partBytes, size - offset);
    const partName = `${name}.${String(index).padStart(2, '0')}`;
    await pipeline(
      createReadStream(zipPath, { start: offset, end: offset + length - 1 }),
      createWriteStream(path.join(download, partName)),
    );
    const written = (await stat(path.join(download, partName))).size;
    if (written !== length || written >= 50_000_000) throw new Error(`${partName} is ${written} bytes`);
    parts.push({ name: partName, size: written });
    offset += length;
    index += 1;
  }
  console.log(`Split ${name} into ${parts.length} pieces`);
  return parts;
}

const electronPkg = JSON.parse(await readFile(path.join(desktop, 'node_modules', 'electron', 'package.json'), 'utf8'));
await run(process.execPath, [path.join(root, 'scripts', 'copy-desktop.mjs')], root);
const hasIcon = await icons();
await rm(out, { recursive: true, force: true });
await mkdir(download, { recursive: true });
const packager = path.join(desktop, 'node_modules', '@electron', 'packager', 'bin', 'electron-packager.mjs');
await access(packager);
const manifest = { files: {} };
for (const [platform, arch, folder, zipName] of targets) {
  const args = [
    packager,
    desktop,
    'LibreSky',
    `--platform=${platform}`,
    `--arch=${arch}`,
    `--out=${out}`,
    '--overwrite',
    '--asar',
    `--electron-version=${electronPkg.version}`,
  ];
  if (hasIcon) args.push(`--icon=${path.join(desktop, 'icon')}`);
  await run(process.execPath, args, desktop);
  await prunePack(path.join(out, folder));
  const zipPath = path.join(download, zipName);
  await rm(zipPath, { force: true });
  await run('zip', ['-9', '-ry', zipPath, folder], out);
  console.log(`Wrote ${zipPath}`);
}
await clearParts();
for (const [, , , zipName] of targets) {
  manifest.files[zipName] = await splitZip(path.join(download, zipName));
}
await writeFile(path.join(download, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await rm(out, { recursive: true, force: true });
