"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seoInterceptor = void 0;
const functions = __importStar(require("firebase-functions"));
const express = require("express");
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const app = express();
const SUPABASE_URL = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
// Lista de User-Agents correspondientes a bots de redes sociales
const botUserAgents = [
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'skypeuripreview',
    'telegrambot',
    'googlebot',
    'bingbot'
];
const isBot = (userAgent) => {
    if (!userAgent)
        return false;
    const lowerUA = userAgent.toLowerCase();
    return botUserAgents.some(bot => lowerUA.includes(bot));
};
const fetchSupabaseData = async (table, id) => {
    try {
        const response = await (0, node_fetch_1.default)(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}&select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            return data[0];
        }
        return null;
    }
    catch (e) {
        console.error('Error fetching Supabase data:', e);
        return null;
    }
};
const injectMetaTags = (html, tags) => {
    let injectedHtml = html;
    for (const [key, value] of Object.entries(tags)) {
        if (!value)
            continue;
        const metaString = `<meta property="${key}" content="${value.replace(/"/g, '&quot;')}" />\n`;
        injectedHtml = injectedHtml.replace('</head>', `${metaString}</head>`);
    }
    return injectedHtml;
};
app.get('**', async (req, res) => {
    try {
        const userAgent = req.headers['user-agent'];
        const isBotRequest = isBot(userAgent);
        // Path del index.html alojado localmente en Functions
        const indexPath = path.resolve(__dirname, '../../dist/arecofix/browser/index.html');
        let html = '';
        try {
            html = fs.readFileSync(indexPath, 'utf8');
        }
        catch (e) {
            // Si el archivo no se encuentra, posiblemente porque se ejecuta de forma aislada
            res.status(404).send('Not Found');
            return;
        }
        if (isBotRequest) {
            let metaTags = {};
            const pathParts = req.path.split('/').filter((p) => p.trim() !== '');
            if (pathParts[0] === 'curso' && pathParts[1]) {
                const courseId = pathParts[1];
                const course = await fetchSupabaseData('courses', courseId);
                if (course) {
                    metaTags = {
                        'og:title': course.title || 'Curso en Arecofix Academy',
                        'og:description': course.description || 'Aprende con nosotros en Arecofix Academy',
                        'og:image': course.image_url || 'https://arecofix.com.ar/assets/images/default-course.jpg',
                        'og:url': `https://arecofix.com.ar${req.path}`,
                        'og:type': 'website'
                    };
                }
            }
            else if (pathParts[0] === 'producto' && pathParts[1]) {
                const productId = pathParts[1];
                const product = await fetchSupabaseData('products', productId);
                if (product) {
                    metaTags = {
                        'og:title': product.name || 'Producto en Arecofix',
                        'og:description': product.description || 'Servicio Técnico Especializado',
                        'og:image': product.image_url || 'https://arecofix.com.ar/assets/images/default-product.jpg',
                        'og:url': `https://arecofix.com.ar${req.path}`,
                        'og:type': 'website'
                    };
                }
            }
            if (Object.keys(metaTags).length > 0) {
                html = injectMetaTags(html, metaTags);
            }
        }
        // Devolvemos el HTML original o con las etiquetas inyectadas
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.send(html);
    }
    catch (e) {
        console.error('Error in SEO interceptor:', e);
        res.status(500).send('Internal Server Error');
    }
});
exports.seoInterceptor = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map