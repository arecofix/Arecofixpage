import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRepairStatsComponent } from './repair-stats.component';
import { RepairStatsService, RepairStatsDto } from './repair-stats.service';
import { AuthService } from '@app/core/services/auth.service';
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { TenantService } from '@app/core/services/tenant.service';
import { of } from 'rxjs';

describe('AdminRepairStatsComponent', () => {
  let component: AdminRepairStatsComponent;
  let fixture: ComponentFixture<AdminRepairStatsComponent>;
  let mockStatsService: any;
  let mockCustomerService: any;
  let mockAuthService: any;
  let mockTenantService: any;

  const mockStatsDto: RepairStatsDto = {
    total_facturado: 0,
    spare_part_costs: 0,
    ganancia_neta: 0,
    margen_porcentaje: 0,
    ticket_promedio: 0,
    total_reparaciones: 0,
    reparaciones_vidrio: 0,
    reparaciones_vidrio_global: 2,
    ingreso_extra_vidrio: 0,
    ingreso_extra_vidrio_global: 5000,
    equipos_recibidos: 0,
    equipos_entregados: 0,
    equipos_entregados_global: 3,
    garantias_efectivas: 0,
    equipos_espera: 0,
    devoluciones_cantidad: 0,
    devoluciones_monto: 0,
    venta_total_global: 602200,
    venta_total_periodo: 0,
    monthly_data: [
      { mes: '2026-10', label: 'Oct 26', ingreso: 238400, costo: 112300, ganancia: 126100, ratio: 47 }
    ]
  };

  beforeEach(async () => {
    mockStatsService = {
      getStats: jest.fn().mockReturnValue(of(mockStatsDto))
    };

    mockCustomerService = {
      getAll: jest.fn().mockResolvedValue([])
    };

    mockAuthService = {
      getSupabaseClient: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: [] })
        })
      })
    };

    mockTenantService = {
      getTenantId: jest.fn().mockReturnValue('tenant-test-id')
    };

    await TestBed.configureTestingModule({
      imports: [AdminRepairStatsComponent],
      providers: [
        { provide: RepairStatsService, useValue: mockStatsService },
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: TenantService, useValue: mockTenantService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRepairStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize and display current period label based on period selection', () => {
    const now = new Date();
    const monthNames = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    const currentMonthLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    // Default period is 'this_month'
    expect(component.period()).toBe('this_month');
    expect(component.currentPeriodLabel()).toBe(currentMonthLabel);

    // Switch to 'last_month'
    component.period.set('last_month');
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthLabel = `${monthNames[prevDate.getMonth()]} ${prevDate.getFullYear()}`;
    expect(component.currentPeriodLabel()).toBe(prevMonthLabel);

    // Switch to 'all_time'
    component.period.set('all_time');
    expect(component.currentPeriodLabel()).toBe('Histórico');
  });

  it('should render consolidated global revenue and period revenue properly', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Check that global consolidated revenue is rendered
    expect(compiled.textContent).toContain('602.200');
    expect(compiled.textContent).toContain('Ingresos Consolidados (Global)');
    expect(compiled.textContent).toContain('ACUMULADO HISTÓRICO');
  });

  it('should format currencies and numbers accurately', () => {
    expect(component.formatARS(0)).toBe('ARS 0');
    expect(component.formatARS(562200)).toBe('ARS 562.200');
    expect(component.formatCompact(562200)).toBe('$562k');
    expect(component.formatCompact(1500000)).toBe('$1.5M');
    expect(component.formatCompact(500)).toBe('$500');
  });
});
