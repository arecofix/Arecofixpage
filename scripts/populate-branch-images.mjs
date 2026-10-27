import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');
const destDir = path.join(rootDir, 'public', 'assets', 'img', 'branches', 'zona-norte');
const sourceJpg = path.join(rootDir, 'public', 'assets', 'img', 'branding', 'inicio.jpg');
const sourceAcademy = path.join(rootDir, 'public', 'assets', 'img', 'branding', 'academy.jpg');
const sourceLogo = path.join(rootDir, 'public', 'assets', 'img', 'branding', 'LOGO_ARECOFIX.png');
const sourceFavicon = path.join(rootDir, 'public', 'favicon.ico');
const sourceNoImage = path.join(rootDir, 'public', 'assets', 'img', 'no-image.png');
const sourceSvg = path.join(rootDir, 'public', 'assets', 'img', 'pattern-grid.svg');
const sourceAvatar = path.join(rootDir, 'public', 'assets', 'img', 'perfil.jpeg');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function findMatches(dir, regex, results = new Set()) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findMatches(fullPath, regex, results);
    } else if (/\.(ts|html|scss|css)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      let m;
      while ((m = regex.exec(content)) !== null) {
        results.add(m[1]);
      }
    }
  }
  return results;
}

// 1. Zona Norte assets
const pattern = /assets\/img\/branches\/zona-norte\/([^'"`\s\)]+)/g;
const matchedFiles = findMatches(srcDir, pattern);

console.log(`Found ${matchedFiles.size} unique image references for zona-norte.`);

for (const relFile of matchedFiles) {
  const cleanPath = relFile.split('?')[0].split('#')[0];
  const targetPath = path.join(destDir, cleanPath);
  const targetSubDir = path.dirname(targetPath);
  if (!fs.existsSync(targetSubDir)) {
    fs.mkdirSync(targetSubDir, { recursive: true });
  }

  if (cleanPath.endsWith('.ico')) {
    fs.copyFileSync(sourceFavicon, targetPath);
  } else if (cleanPath.endsWith('.png')) {
    fs.copyFileSync(sourceLogo, targetPath);
  } else {
    fs.copyFileSync(sourceJpg, targetPath);
  }
}

// 2. All other missing global assets
const generalMissing = [
  { path: 'public/assets/img/branding/og-academy.jpg', src: sourceAcademy },
  { path: 'public/assets/img/placeholder.png', src: sourceNoImage },
  { path: 'public/assets/img/product-placeholder.jpg', src: sourceNoImage },
  { path: 'public/assets/img/placeholder-course.jpg', src: sourceAcademy },
  { path: 'public/assets/img/hero-illustration.svg', src: sourceSvg },
  { path: 'public/assets/img/hero-repair.jpg', src: sourceJpg },
  { path: 'public/assets/default-avatar.png', src: sourceAvatar },
  { path: 'public/assets/img/default-avatar.png', src: sourceAvatar },
  { path: 'public/assets/img/branding/logotipo-s-blanco.png', src: sourceLogo },
  { path: 'public/assets/img/branding/logotipo-s-negro.png', src: sourceLogo },
  { path: 'public/assets/img/misc/placeholder.jpg', src: sourceNoImage },
  { path: 'public/assets/img/placeholder/bathroom-placeholder.jpg', src: sourceJpg },
  { path: 'public/assets/img/services/banera-antes.jpg', src: sourceJpg },
  { path: 'public/assets/img/placeholder/before-placeholder.jpg', src: sourceJpg },
  { path: 'public/assets/img/services/banera-despues.jpg', src: sourceJpg },
  { path: 'public/assets/img/placeholder/after-placeholder.jpg', src: sourceJpg },
  { path: 'public/assets/img/services/argentina-map.svg', src: sourceSvg },
  { path: 'public/assets/img/placeholder/map-placeholder.jpg', src: sourceJpg },
  { path: 'public/assets/img/services/banera-1.jpg', src: sourceJpg },
  { path: 'public/assets/img/services/banera-2.jpg', src: sourceJpg },
  { path: 'public/assets/img/services/banera-3.jpg', src: sourceJpg },
  { path: 'public/assets/img/services/banera-4.jpg', src: sourceJpg },
  { path: 'public/assets/img/services/banera-5.jpg', src: sourceJpg },
  { path: 'public/assets/img/academy/mockup-guia-pdf.png', src: sourceAcademy },
];

for (const item of generalMissing) {
  const fullTarget = path.join(rootDir, item.path);
  const dir = path.dirname(fullTarget);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync(item.src, fullTarget);
}

console.log(`All missing general assets generated and synchronized successfully.`);
