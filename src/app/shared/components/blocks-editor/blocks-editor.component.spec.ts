import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlocksEditorComponent } from './blocks-editor.component';
import { ServicesApplicationService } from '@app/features/services/application/services/services-application.service';
import { of } from 'rxjs';

describe('BlocksEditorComponent', () => {
  let component: BlocksEditorComponent;
  let fixture: ComponentFixture<BlocksEditorComponent>;
  let mockServicesApp: any;

  beforeEach(async () => {
    mockServicesApp = {
      getBlocks: jest.fn().mockResolvedValue([]),
      upsertBlocks: jest.fn().mockResolvedValue([]),
      deleteBlock: jest.fn().mockResolvedValue(undefined),
      reorderBlocks: jest.fn().mockResolvedValue(undefined),
      submitLead: jest.fn().mockResolvedValue({ id: '1' }),
    };

    await TestBed.configureTestingModule({
      imports: [BlocksEditorComponent],
      providers: [
        { provide: ServicesApplicationService, useValue: mockServicesApp },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlocksEditorComponent);
    component = fixture.componentInstance;
    component.ownerType = 'service';
    component.ownerId = 'svc-123';
  });

  it('should initialize and add a new Hero block', () => {
    fixture.detectChanges();

    component.addBlock('hero');
    expect(component.blocks().length).toBe(1);
    expect(component.blocks()[0].block_type).toBe('hero');
    expect(component.blocks()[0].content['title']).toBe('Título Destacado');
  });

  it('should toggle block enabled status', () => {
    fixture.detectChanges();
    component.addBlock('features');

    expect(component.blocks()[0].is_enabled).toBe(true);
    component.toggleBlockEnabled(0);
    expect(component.blocks()[0].is_enabled).toBe(false);
  });

  it('should switch preview modes (split, editor, preview)', () => {
    expect(component.previewMode()).toBe('split');
    component.previewMode.set('preview');
    expect(component.previewMode()).toBe('preview');
    component.previewMode.set('editor');
    expect(component.previewMode()).toBe('editor');
  });
});
