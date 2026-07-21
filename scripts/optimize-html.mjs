import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browserDir = path.join(__dirname, '../dist/arecofix/browser');

function optimizeHtmlFiles(dir) {
    let optimizedCount = 0;
    let bytesSaved = 0;

    const walk = (currentDir) => {
        const files = fs.readdirSync(currentDir);
        for (const file of files) {
            const fullPath = path.join(currentDir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else if (fullPath.endsWith('.html')) {
                const originalContent = fs.readFileSync(fullPath, 'utf8');
                let optimizedContent = originalContent;

                // 1. Remove modulepreload and preload links (Cloudflare / Cleanliness)
                optimizedContent = optimizedContent.replace(/<link rel="(modulepreload|preload)"[^>]*>/gi, '');

                // 2. Remove ng-state JSON block which causes huge HTML bloating in SSG
                optimizedContent = optimizedContent.replace(/<script id="ng-state"[^>]*>.*?<\/script>/is, '');
                
                // 3. (Optional safety) Strip inline Angular style if any lingering
                // Note: inlineCritical=false handles the main styles, but some smaller ones might remain. We will leave them if they are small.
                
                if (originalContent.length !== optimizedContent.length) {
                    fs.writeFileSync(fullPath, optimizedContent, 'utf8');
                    bytesSaved += (originalContent.length - optimizedContent.length);
                    optimizedCount++;
                }
            }
        }
    };

    console.log(`🚀 Starting aggressive HTML optimization...`);
    if (fs.existsSync(browserDir)) {
        walk(browserDir);
        console.log(`✅ Optimized ${optimizedCount} HTML files.`);
        console.log(`📉 Total bytes saved: ${(bytesSaved / 1024 / 1024).toFixed(2)} MB`);
    } else {
        console.error(`⚠️ Directory ${browserDir} not found.`);
    }
}

function generate404Html() {
    const notFoundDir = path.join(browserDir, 'not-found');
    const notFoundIndex = path.join(notFoundDir, 'index.html');
    const dest404 = path.join(browserDir, '404.html');
    const publicPath = path.join(browserDir, 'index.html');

    if (fs.existsSync(notFoundIndex)) {
        fs.copyFileSync(notFoundIndex, dest404);
        console.log('✅ Generated 404.html from pre-rendered not-found page.');
    } else if (fs.existsSync(publicPath)) {
        fs.copyFileSync(publicPath, dest404);
        console.log('⚠️ not-found page not pre-rendered — using index.html as fallback 404.html.');
    } else {
        console.warn('⚠️ Could not generate 404.html: no source file found.');
    }
}

optimizeHtmlFiles(browserDir);
generate404Html();
