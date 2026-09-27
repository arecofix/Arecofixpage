const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      // Replace cy.intercept('**/rest/v1/**' with cy.intercept('GET', '**/rest/v1/**'
      content = content.replace(/cy\.intercept\(['\"]\*\*\/rest\/v1\/\*\*['\"]/g, "cy.intercept('GET', '**/rest/v1/**'");
      // Replace cy.intercept('**/rpc/**' with cy.intercept('GET', '**/rpc/**'
      content = content.replace(/cy\.intercept\(['\"]\*\*\/rpc\/\*\*['\"]/g, "cy.intercept('GET', '**/rpc/**'");
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

processDir('cypress');
