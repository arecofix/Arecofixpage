import 'zone.js';
import 'zone.js/testing';
import { TextEncoder, TextDecoder } from 'util';

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

class MockHeaders {
  private map = new Map<string, string>();
  constructor(init?: any) {
    if (init) {
      if (Array.isArray(init)) {
        init.forEach(([k, v]) => this.map.set(k.toLowerCase(), v));
      } else if (typeof init.forEach === 'function') {
        init.forEach((v: string, k: string) => this.map.set(k.toLowerCase(), v));
      } else if (typeof init === 'object') {
        Object.entries(init).forEach(([k, v]) => this.map.set(k.toLowerCase(), String(v)));
      }
    }
  }
  get(name: string) { return this.map.get(name.toLowerCase()) || null; }
  set(name: string, value: string) { this.map.set(name.toLowerCase(), value); }
  has(name: string) { return this.map.has(name.toLowerCase()); }
  delete(name: string) { this.map.delete(name.toLowerCase()); }
  forEach(callback: (value: string, key: string) => void) {
    this.map.forEach((val, key) => callback(val, key));
  }
}

class MockResponse {
  status: number;
  statusText: string;
  headers: MockHeaders;
  private _bodyText: string;

  constructor(body?: any, init?: { status?: number; statusText?: string; headers?: any }) {
    this._bodyText = body !== undefined && body !== null ? String(body) : '';
    this.status = init?.status ?? 200;
    this.statusText = init?.statusText ?? 'OK';
    this.headers = new MockHeaders(init?.headers);
  }

  get ok() {
    return this.status >= 200 && this.status < 300;
  }

  async text() {
    return this._bodyText;
  }

  async json() {
    return JSON.parse(this._bodyText);
  }

  clone() {
    return new MockResponse(this._bodyText, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers
    });
  }
}

(global as any).Headers = MockHeaders;
(global as any).Response = MockResponse;
if (typeof window !== 'undefined') {
  (window as any).Headers = MockHeaders;
  (window as any).Response = MockResponse;
}

import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
