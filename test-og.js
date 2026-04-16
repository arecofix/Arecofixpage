const fs = require('fs');
const html = fs.readFileSync('dist/arecofix/browser/productos/detalle/modulo-de-iphone-13-oled/index.html', 'utf8');
const match = html.match(/<meta[^>]*property="og:image"[^>]*>/i);
console.log("META TAG FOUND:", match ? match[0] : "None");
