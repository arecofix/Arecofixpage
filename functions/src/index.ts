import * as functions from 'firebase-functions';
import express = require('express');
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';

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

const isBot = (userAgent: string | undefined): boolean => {
    if (!userAgent) return false;
    const lowerUA = userAgent.toLowerCase();
    return botUserAgents.some(bot => lowerUA.includes(bot));
};

const fetchSupabaseData = async (table: string, id: string) => {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}&select=*`, {
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
    } catch (e) {
        console.error('Error fetching Supabase data:', e);
        return null;
    }
};

const injectMetaTags = (html: string, tags: Record<string, string>) => {
    let injectedHtml = html;
    for (const [key, value] of Object.entries(tags)) {
        if (!value) continue;
        const metaString = `<meta property="${key}" content="${value.replace(/"/g, '&quot;')}" />\n`;
        injectedHtml = injectedHtml.replace('</head>', `${metaString}</head>`);
    }
    return injectedHtml;
};

app.get('**', async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userAgent = req.headers['user-agent'];
        const isBotRequest = isBot(userAgent);

        // Path del index.html alojado localmente en Functions
        const indexPath = path.resolve(__dirname, '../../dist/arecofix/browser/index.html');
        let html = '';
        
        try {
            html = fs.readFileSync(indexPath, 'utf8');
        } catch (e) {
            // Si el archivo no se encuentra, posiblemente porque se ejecuta de forma aislada
            res.status(404).send('Not Found');
            return;
        }

        if (isBotRequest) {
            let metaTags: Record<string, string> = {};
            const pathParts = req.path.split('/').filter((p: string) => p.trim() !== '');

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
            } else if (pathParts[0] === 'producto' && pathParts[1]) {
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
    } catch (e) {
        console.error('Error in SEO interceptor:', e);
        res.status(500).send('Internal Server Error');
    }
});

export const seoInterceptor = functions.https.onRequest(app);
