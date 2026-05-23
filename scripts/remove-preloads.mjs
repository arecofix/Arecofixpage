import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browserDir = path.join(__dirname, '../dist/arecofix/browser');
const publicPath = path.join(browserDir, 'index.html');

function removePreloads(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Remove Angular's modulepreload and preload links to avoid Chrome Cloudflare mismatch warnings
        content = content.replace(/<link rel="(modulepreload|preload)"[^>]*>/gi, '');
        fs.writeFileSync(filePath, content);
        console.log(`✅ Cleaned preloads in ${path.basename(filePath)} for Cloudflare compatibility.`);
    }
}

function generate404Html() {
    // Angular pre-renders /not-found as a static folder during `ng build`
    // Copy it to 404.html so Firebase Hosting serves it with a real HTTP 404
    const notFoundDir = path.join(browserDir, 'not-found');
    const notFoundIndex = path.join(notFoundDir, 'index.html');
    const dest404 = path.join(browserDir, '404.html');

    if (fs.existsSync(notFoundIndex)) {
        fs.copyFileSync(notFoundIndex, dest404);
        console.log('✅ Generated 404.html from pre-rendered not-found page.');
    } else if (fs.existsSync(publicPath)) {
        // Fallback: use index.html if not-found was not pre-rendered
        fs.copyFileSync(publicPath, dest404);
        console.log('⚠️  not-found page not pre-rendered — using index.html as fallback 404.html.');
    } else {
        console.warn('⚠️  Could not generate 404.html: no source file found.');
    }
}

removePreloads(publicPath);
generate404Html();
