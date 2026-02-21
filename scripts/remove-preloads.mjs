import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, '../dist/arecofix/browser/index.html');

function removePreloads(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Remove Angular's modulepreload and preload links to avoid Chrome Cloudflare mismatch warnings
        content = content.replace(/<link rel="(modulepreload|preload)"[^>]*>/gi, '');
        fs.writeFileSync(filePath, content);
        console.log(`✅ Cleaned preloads in ${path.basename(filePath)} for Cloudflare compatibility.`);
    }
}

removePreloads(publicPath);
