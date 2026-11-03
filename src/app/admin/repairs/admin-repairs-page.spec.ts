import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { AdminRepairsPage } from './admin-repairs-page';
import { AdminRepairService } from '@app/features/repairs/application/services/admin-repair.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { TranslationService, TRANSLATIONS } from '@app/core/services/translation.service';
import { OfflineSyncService } from '@app/core/services/offline-sync.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AdminRepairsPage', () => {
  let component: AdminRepairsPage;
  let fixture: ComponentFixture<AdminRepairsPage>;
  let mockRepairService: any;
  let mockBranchContextService: any;
  let currentBranchSignal: any;

  beforeEach(async () => {
    currentBranchSignal = signal<string | null>('branch-central-123');

    mockRepairService = {
      getAdminList: jest.fn().mockResolvedValue([]),
      getWorkshopSummary: jest.fn().mockResolvedValue({
        inWorkshop: 2,
        readyToPickup: 1,
        pendingParts: 0,
        thisMonthProfit: 50000
      })
    };

    mockBranchContextService = {
      currentBranchId: currentBranchSignal
    };

    await TestBed.configureTestingModule({
      imports: [AdminRepairsPage],
      providers: [
        { provide: AdminRepairService, useValue: mockRepairService },
        { provide: BranchContextService, useValue: mockBranchContextService },
        { provide: TranslationService, useValue: { t: signal(TRANSLATIONS.es) } },
        { provide: OfflineSyncService, useValue: { pendingCount: signal(0) } },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRepairsPage);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load repairs and summary on initialization without duplicate calls', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    // Verify each was called exactly once on init
    expect(mockRepairService.getAdminList).toHaveBeenCalledTimes(1);
    expect(mockRepairService.getWorkshopSummary).toHaveBeenCalledTimes(1);
    expect(component.summary().inWorkshop).toBe(2);
    expect(component.summary().thisMonthProfit).toBe(50000);
  });
});
