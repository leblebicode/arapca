import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'src/app/version.ts'), 'utf8');
const match = source.match(/APP_VERSION = '([^']+)'/);

if (!match) {
  throw new Error('APP_VERSION not found in src/app/version.ts');
}

const outDir = join(root, 'dist/arapca/browser');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'version.json'), `${JSON.stringify({ version: match[1] })}\n`);
