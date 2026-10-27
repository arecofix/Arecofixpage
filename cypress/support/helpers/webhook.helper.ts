import * as crypto from 'crypto';

export interface WebhookSignatureOptions {
  secret: string;
  dataId: string;
  requestId: string;
  timestamp?: number;
}

export function generateMpWebhookSignature(options: WebhookSignatureOptions): string {
  const ts = options.timestamp || Math.floor(Date.now() / 1000);
  const manifest = `id:${options.dataId};request-id:${options.requestId};ts:${ts};`;
  const hash = crypto.createHmac('sha256', options.secret).update(manifest).digest('hex');
  return `ts=${ts},v1=${hash}`;
}
