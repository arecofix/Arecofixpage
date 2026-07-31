const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.html') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('src/app');
let replacedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Repairs: upsell_vidrio -> glass_upsell
    content = content.replace(/upsell_vidrio/g, 'glass_upsell');
    // Repairs: costo_repuesto -> spare_part_cost
    content = content.replace(/costo_repuesto/g, 'spare_part_cost');
    content = content.replace(/costo_repuestos/g, 'spare_part_costs');
    
    // Products: unit_cost_at_time -> cost_price
    content = content.replace(/unit_cost_at_time/g, 'cost_price');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        replacedCount++;
        console.log('Updated:', file);
    }
});
console.log('Total files updated:', replacedCount);
