import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockRendererComponent } from './block-renderer.component';
import { ServicesApplicationService } from '@app/features/services/application/services/services-application.service';
import { ServiceBlockDto } from '@app/features/services/domain/dtos/service.dto';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('BlockRendererComponent', () => {
  let component: BlockRendererComponent;
  let fixture: ComponentFixture<BlockRendererComponent>;
  let mockServicesApp: any;

  beforeEach(async () => {
    mockServicesApp = {
      submitLead: jest.fn().mockResolvedValue({ id: 'lead-123' }),
    };

    await TestBed.configureTestingModule({
      imports: [BlockRendererComponent],
      providers: [
        { provide: ServicesApplicationService, useValue: mockServicesApp },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockRendererComponent);
    component = fixture.componentInstance;
  });

  it('should render a Hero block with title and subtitle', () => {
    const heroBlock: ServiceBlockDto = {
      id: 'b-hero',
      owner_type: 'service',
      owner_id: 'svc-1',
      block_type: 'hero',
      content: {
        title: 'Reparación de Celulares en Marcos Paz',
        subtitle: 'Servicio técnico especializado con repuestos originales.',
        ctaLabel: 'Pedir Presupuesto',
        ctaHref: '#contacto',
        align: 'left',
      },
      order_index: 0,
      is_enabled: true,
    };

    component.block = heroBlock;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Reparación de Celulares en Marcos Paz');
    expect(compiled.textContent).toContain('Servicio técnico especializado');
  });

  it('should render FAQ accordion accessible details tag', () => {
    const faqBlock: ServiceBlockDto = {
      id: 'b-faq',
      owner_type: 'service',
      owner_id: 'svc-1',
      block_type: 'faq',
      content: {
        title: 'Preguntas Frecuentes',
        items: [
          { question: '¿Dan garantía escrita?', answer: 'Sí, 90 días en todas las reparaciones.' },
        ],
      },
      order_index: 1,
      is_enabled: true,
    };

    component.block = faqBlock;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const summary = compiled.querySelector('summary');
    expect(summary?.textContent).toContain('¿Dan garantía escrita?');
  });

  it('should render contact block and submit lead form', async () => {
    const contactBlock: ServiceBlockDto = {
      id: 'b-contact',
      owner_type: 'service',
      owner_id: 'svc-1',
      block_type: 'contact',
      content: {
        title: 'Pedí tu Presupuesto',
        subtitle: 'Completá tus datos.',
      },
      order_index: 2,
      is_enabled: true,
    };

    component.block = contactBlock;
    component.serviceId = 'svc-1';
    component.serviceName = 'Auditoría';
    fixture.detectChanges();

    component.leadName.set('Carlos');
    component.leadPhone.set('1125960900');
    component.leadMessage.set('Necesito presupuesto urgente');

    await component.submitLeadForm();

    expect(mockServicesApp.submitLead).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Carlos',
        phone: '1125960900',
        service_id: 'svc-1',
      })
    );
    expect(component.leadSuccess()).toBe(true);
  });

  it('should render service_list cross-selling block with dynamic services', async () => {
    mockServicesApp.getPublicServices = jest.fn().mockResolvedValue([
      { id: 'svc-1', name: 'Servicio Actual', slug: 'servicio-actual', short_description: 'Desc 1', is_published: true },
      { id: 'svc-2', name: 'Reparación de Celulares', slug: 'reparacion-celulares', short_description: 'Arreglo en el acto', is_published: true },
      { id: 'svc-3', name: 'Desarrollo Web', slug: 'desarrollo-web', short_description: 'Sitios y software', is_published: true },
    ]);

    const serviceListBlock: ServiceBlockDto = {
      id: 'b-services',
      owner_type: 'service',
      owner_id: 'svc-1',
      block_type: 'service_list',
      content: {
        title: 'Otros Servicios Destacados',
        limit: 3,
      },
      order_index: 3,
      is_enabled: true,
    };

    component.block = serviceListBlock;
    component.serviceId = 'svc-1'; // Current service to exclude
    await component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Otros Servicios Destacados');
    // Current service (svc-1) should be excluded; other 2 services should be present
    expect(component.publicServices().length).toBe(2);
    expect(compiled.textContent).toContain('Reparación de Celulares');
    expect(compiled.textContent).toContain('Desarrollo Web');
    expect(compiled.textContent).not.toContain('Servicio Actual');
  });

  describe('SEC-001: Markdown XSS Sanitization', () => {
    it('should strip malicious <script> tags and onload attributes from markdown', () => {
      const maliciousBlock: ServiceBlockDto = {
        id: 'b-content-xss',
        owner_type: 'service',
        owner_id: 'svc-1',
        block_type: 'content',
        content: {
          content: 'Texto seguro **en negrita** <script>alert("XSS")</script><img src="x" onerror="alert(1)">',
        },
        order_index: 0,
        is_enabled: true,
      };

      component.block = maliciousBlock;
      fixture.detectChanges();

      const sanitized = component.sanitizedMarkdown;
      // In Angular tests, SafeHtml object wraps the HTML string or inspect string representation
      const htmlStr = (sanitized as unknown as { changingThisBreaksApplicationSecurity?: string })
        ?.changingThisBreaksApplicationSecurity ?? String(sanitized);

      expect(htmlStr).not.toContain('<script');
      expect(htmlStr).not.toContain('onerror=');
      expect(htmlStr).toContain('<strong>en negrita</strong>');
      expect(htmlStr).toContain('Texto seguro');
    });

    it('should strip dangerous javascript: URLs and iframe tags', () => {
      const exploitBlock: ServiceBlockDto = {
        id: 'b-exploit',
        owner_type: 'service',
        owner_id: 'svc-1',
        block_type: 'content',
        content: {
          content: '<iframe src="https://evil.com"></iframe><a href="javascript:stealCookie()">Click</a>',
        },
        order_index: 1,
        is_enabled: true,
      };

      component.block = exploitBlock;
      fixture.detectChanges();

      const sanitized = component.sanitizedMarkdown;
      const htmlStr = (sanitized as unknown as { changingThisBreaksApplicationSecurity?: string })
        ?.changingThisBreaksApplicationSecurity ?? String(sanitized);

      expect(htmlStr).not.toContain('<iframe');
      expect(htmlStr).not.toContain('javascript:');
    });
  });
});

