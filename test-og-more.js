const fs = require('fs');
const html = fs.readFileSync('dist/arecofix/browser/productos/detalle/modulo-de-iphone-13-oled/index.html', 'utf8');

const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*>/i);
const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*>/i);
const urlMatch = html.match(/<meta[^>]*property="og:url"[^>]*>/i);

console.log("Title:", titleMatch ? titleMatch[0] : "None");
console.log("Desc:", descMatch ? descMatch[0] : "None");
console.log("Url:", urlMatch ? urlMatch[0] : "None");
