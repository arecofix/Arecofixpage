import fs from 'fs';
import path from 'path';

function findRefs(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      findRefs(full, list);
    } else if (/\.(html|ts)$/.test(e.name)) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/['"](assets\/[a-zA-Z0-9_\-\.\/]+\.(?:png|jpg|jpeg|webp|svg|ico|gif))['"]/gi);
      for (const m of matches) {
        list.push({ file: full, asset: m[1] });
      }
    }
  }
  return list;
}

const refs = findRefs('src');
const missing = new Map();
for (const r of refs) {
  const p1 = path.join('public', r.asset);
  const p2 = path.join('src', r.asset);
  if (!fs.existsSync(p1) && !fs.existsSync(p2)) {
    if (!missing.has(r.asset)) {
      missing.set(r.asset, []);
    }
    missing.get(r.asset).push(path.relative(process.cwd(), r.file));
  }
}

console.log(`Found ${missing.size} unique missing image assets:`);
for (const [asset, files] of missing.entries()) {
  console.log(`- ${asset} (in ${files.slice(0, 2).join(', ')}${files.length > 2 ? '...' : ''})`);
}
