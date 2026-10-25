import { Router, Request, Response } from 'express';

export const chatbotRoutes = Router();

function getChatbotConfig() {
  const workerUrl = (process.env['CHATBOT_WORKER_URL'] || 'https://arecofix-rag-chatbot.ezequielenrico15.workers.dev').replace(/\/+$/, '');
  const secret = process.env['CHATBOT_SECRET'] || '';
  return { workerUrl, secret };
}

// Handler para consultas completas offline (JSON)
chatbotRoutes.post(['/message', '/offline'], async (req: Request, res: Response) => {
  try {
    const { workerUrl, secret } = getChatbotConfig();
    if (!secret) {
      return res.status(500).json({ error: 'Chatbot service secret not configured on server' });
    }

    const workerRes = await fetch(`${workerUrl}/chat/offline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`
      },
      body: JSON.stringify(req.body)
    });

    const status = workerRes.status;
    const data = await workerRes.json().catch(() => ({}));
    return res.status(status).json(data);
  } catch (err: any) {
    console.error('[Chatbot Proxy Error]', err);
    return res.status(502).json({ error: 'Error connecting to chatbot worker' });
  }
});

// Handler para streaming token-by-token (SSE)
chatbotRoutes.post('/stream', async (req: Request, res: Response) => {
  try {
    const { workerUrl, secret } = getChatbotConfig();
    if (!secret) {
      return res.status(500).json({ error: 'Chatbot service secret not configured on server' });
    }

    const workerRes = await fetch(`${workerUrl}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`
      },
      body: JSON.stringify(req.body)
    });

    res.status(workerRes.status);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    if (workerRes.body) {
      const reader = workerRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
    }
    return res.end();
  } catch (err: any) {
    console.error('[Chatbot Stream Proxy Error]', err);
    if (!res.headersSent) {
      return res.status(502).json({ error: 'Error streaming from chatbot worker' });
    }
    return res.end();
  }
});
