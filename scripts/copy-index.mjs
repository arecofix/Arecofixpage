import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname, '../dist/arecofix/browser/index.csr.html');
const dest = path.join(__dirname, '../dist/arecofix/browser/index.html');

try {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    console.log('✅ Successfully copied index.csr.html to index.html for Tauri build.');
  } else {
    console.warn('⚠️ Warning: index.csr.html not found, skipping copy.');
  }
} catch (err) {
  console.error('❌ Error copying index.csr.html:', err);
  process.exit(1);
}
