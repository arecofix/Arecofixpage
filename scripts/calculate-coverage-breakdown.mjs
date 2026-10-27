import fs from 'fs';

const cov = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));

function getStats(pattern) {
  let sTotal = 0, sCovered = 0;
  let bTotal = 0, bCovered = 0;
  let fTotal = 0, fCovered = 0;
  let filesCount = 0;
  const fileDetails = [];

  for (const [rawPath, fileCov] of Object.entries(cov)) {
    const normalized = rawPath.split('\\').join('/');
    if (!normalized.includes(pattern)) continue;
    filesCount++;

    let fileSTotal = 0, fileSCovered = 0;
    for (const count of Object.values(fileCov.s)) {
      sTotal++; fileSTotal++;
      if (count > 0) { sCovered++; fileSCovered++; }
    }
    for (const counts of Object.values(fileCov.b)) {
      for (const count of counts) {
        bTotal++;
        if (count > 0) bCovered++;
      }
    }
    for (const count of Object.values(fileCov.f)) {
      fTotal++;
      if (count > 0) fCovered++;
    }
    const rel = normalized.split('src/app/')[1] || normalized;
    const pct = fileSTotal ? ((fileSCovered / fileSTotal) * 100).toFixed(1) : '100.0';
    fileDetails.push({ file: rel, stmtsPct: pct, covered: fileSCovered, total: fileSTotal });
  }

  const sPct = sTotal ? ((sCovered / sTotal) * 100).toFixed(2) : '0.00';
  const bPct = bTotal ? ((bCovered / bTotal) * 100).toFixed(2) : '0.00';
  const fPct = fTotal ? ((fCovered / fTotal) * 100).toFixed(2) : '0.00';

  return { pattern, filesCount, sPct, sCovered, sTotal, bPct, bCovered, bTotal, fPct, fCovered, fTotal, fileDetails };
}

console.log('=== GLOBAL SUMMARY ===');
let gSTotal = 0, gSCovered = 0, gBTotal = 0, gBCovered = 0, gFTotal = 0, gFCovered = 0;
for (const fileCov of Object.values(cov)) {
  for (const count of Object.values(fileCov.s)) { gSTotal++; if (count > 0) gSCovered++; }
  for (const counts of Object.values(fileCov.b)) { for (const count of counts) { gBTotal++; if (count > 0) gBCovered++; } }
  for (const count of Object.values(fileCov.f)) { gFTotal++; if (count > 0) gFCovered++; }
}
console.log(`Global Files: ${Object.keys(cov).length}`);
console.log(`Statements: ${((gSCovered / gSTotal) * 100).toFixed(2)}% (${gSCovered}/${gSTotal})`);
console.log(`Branches:   ${((gBCovered / gBTotal) * 100).toFixed(2)}% (${gBCovered}/${gBTotal})`);
console.log(`Functions:  ${((gFCovered / gFTotal) * 100).toFixed(2)}% (${gFCovered}/${gFTotal})`);

['core/interceptors', 'features/orders', 'features/services'].forEach(p => {
  const res = getStats(p);
  console.log(`\n======================================================================`);
  console.log(`=== Module: ${res.pattern} ===`);
  console.log(`Files: ${res.filesCount} | Statements: ${res.sPct}% (${res.sCovered}/${res.sTotal}) | Branches: ${res.bPct}% (${res.bCovered}/${res.bTotal}) | Functions: ${res.fPct}% (${res.fCovered}/${res.fTotal})`);
  console.log(`----------------------------------------------------------------------`);
  res.fileDetails.sort((a,b) => parseFloat(a.stmtsPct) - parseFloat(b.stmtsPct)).forEach(fd => {
    console.log(`  ${fd.stmtsPct.padStart(5, ' ')}% (${fd.covered.toString().padStart(3, ' ')}/${fd.total.toString().padEnd(3, ' ')}) -> ${fd.file}`);
  });
});
