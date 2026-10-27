import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { WhatsappService } from './whatsapp.service';
import { TenantService } from './tenant.service';
import { LoggerService } from './logger.service';

describe('WhatsappService', () => {
  let service: WhatsappService;
  let httpMock: HttpTestingController;
  let mockTenantService: { getTenantId: jest.Mock };
  let mockLogger: { info: jest.Mock; warn: jest.Mock; error: jest.Mock };

  beforeEach(() => {
    mockTenantService = {
      getTenantId: jest.fn().mockReturnValue('test-tenant-123')
    };

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        WhatsappService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TenantService, useValue: mockTenantService },
        { provide: LoggerService, useValue: mockLogger }
      ]
    });

    service = TestBed.inject(WhatsappService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Local Dev Environment (Simulated Dispatch)', () => {
    beforeEach(() => {
      // Force isLocalDev() to return true
      jest.spyOn(service as any, 'isLocalDev').mockReturnValue(true);
    });

    it('should simulate text message without making HTTP network calls', (done) => {
      service.sendTextMessage('1122334455', 'Hola testing').subscribe({
        next: (res) => {
          expect(res).toEqual({ success: true, simulated: true });
          expect(mockLogger.info).toHaveBeenCalledWith(
            expect.stringContaining('[WhatsApp] Dev mode: simulated message to 1122334455')
          );
          // Verify no HTTP requests were made
          httpMock.expectNone(() => true);
          done();
        },
        error: done.fail
      });
    });

    it('should simulate template message without making HTTP network calls', (done) => {
      service.sendTemplateMessage('1122334455', 'quote_ready').subscribe({
        next: (res) => {
          expect(res).toEqual({ success: true, simulated: true });
          expect(mockLogger.info).toHaveBeenCalledWith(
            expect.stringContaining('[WhatsApp] Dev mode: simulated template "quote_ready" to 1122334455')
          );
          // Verify no HTTP requests were made
          httpMock.expectNone(() => true);
          done();
        },
        error: done.fail
      });
    });
  });

  describe('Production Environment (Live Edge Function Dispatch)', () => {
    beforeEach(() => {
      // Force isLocalDev() to return false
      jest.spyOn(service as any, 'isLocalDev').mockReturnValue(false);
    });

    it('should send HTTP POST for text messages with proper auth and tenant headers', (done) => {
      service.sendTextMessage('1122334455', 'Mensaje de produccion').subscribe({
        next: (res) => {
          expect(res).toEqual({ message_id: 'msg_999' });
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne((r) => r.url.includes('/functions/v1/send-whatsapp'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        to: '1122334455',
        type: 'text',
        tenant_id: 'test-tenant-123',
        text: {
          preview_url: false,
          body: 'Mensaje de produccion'
        }
      });
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.has('Authorization')).toBe(true);

      req.flush({ message_id: 'msg_999' });
    });

    it('should send HTTP POST for template messages', (done) => {
      service.sendTemplateMessage('1122334455', 'repair_finished', 'es_AR', [
        { type: 'body', parameters: [{ type: 'text', text: 'Juan' }] }
      ]).subscribe({
        next: (res) => {
          expect(res).toEqual({ message_id: 'msg_1000' });
          done();
        },
        error: done.fail
      });

      const req = httpMock.expectOne((r) => r.url.includes('/functions/v1/send-whatsapp'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body.type).toBe('template');
      expect(req.request.body.template.name).toBe('repair_finished');
      expect(req.request.body.tenant_id).toBe('test-tenant-123');

      req.flush({ message_id: 'msg_1000' });
    });
  });
});
