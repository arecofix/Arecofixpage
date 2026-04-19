import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, from, catchError, of, finalize } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { CompanyService } from '@app/core/services/company.service';
import { BranchService } from '@app/core/services/branch.service';
import { AdminRepairService } from '@app/features/repairs/application/services/admin-repair.service';
import { AdminProductService } from '@app/admin/products/services/admin-product.service';
import { CreateRepairDto, RepairStatus, UpdateRepairDto } from '@app/features/repairs/domain/entities/repair.entity';
import { PricingService } from '@app/core/services/pricing.service';
import { environment } from '@env/environment';
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { NotificationService } from '@app/core/services/notification.service';
import { RepairPdfService } from '@app/features/repairs/application/services/repair-pdf.service';
import { TenantService } from '@app/core/services/tenant.service';
import { RepairWorkflowService } from '@app/features/repairs/application/services/repair-workflow.service';
import { RepairCalculatorService } from '@app/features/repairs/application/services/repair-calculator.service';

import { RepairCustomerSectionComponent } from './components/repair-customer-section.component';
import { RepairDeviceSectionComponent } from './components/repair-device-section.component';
import { RepairPartsSectionComponent } from './components/repair-parts-section.component';
import { RepairFinanceSectionComponent } from './components/repair-finance-section.component';

@Component({
    selector: 'app-admin-repair-form-page',
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule,
        RouterLink,
        RepairCustomerSectionComponent,
        RepairDeviceSectionComponent,
        RepairPartsSectionComponent,
        RepairFinanceSectionComponent
    ],
    templateUrl: './admin-repair-form-page.html',
})
export class AdminRepairFormPage implements OnInit {
    // Helper interface for UI
    private clientView = (client: any) => ({
        ...client,
        displayName: client.full_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.email || 'Sin nombre'
    });
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private companyService = inject(CompanyService);
    private branchService = inject(BranchService);
    private repairService = inject(AdminRepairService);
    private productService = inject(AdminProductService);
    private auth = inject(AuthService);
    private pricingService = inject(PricingService);
    public tenantService = inject(TenantService);
    private customerService = inject(CustomerService);
    private notificationService = inject(NotificationService);
    private repairPdfService = inject(RepairPdfService);
    private fb = inject(FormBuilder);
    private repairWorkflowService = inject(RepairWorkflowService);
    private repairCalculator = inject(RepairCalculatorService);

    repairForm!: FormGroup;

    id: string | null = null;
    date = new Date();
    
    // Initial form state matching entity structure
    initialFormState = {
        customer_id: '', // New field for DB binding
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        customer_dni: '',
        device_model: '',
        device_type: 'smartphone',
        device_brand: 'generic',
        imei: '',
        issue_description: '',
        current_status_id: RepairStatus.PENDING_DIAGNOSIS,
        estimated_cost: 0,
        final_cost: 0,
        technician_notes: '',
        checklist: {
            charger: false,
            battery: false,
            chip: false,
            sd: false,
            case: false
        },
        security_pin: '',
        security_pattern: '',
        device_passcode: '',
        deposit_amount: 0,
        tracking_code: '',
        repair_number: 0,
        images: [] as string[],
        technical_labor_cost: 0,
        technical_report: '',
        parts: [] as import('../../features/repairs/domain/entities/repair.entity').RepairPart[],
        upsell_vidrio: false
    };

    // Keep some UI-only signals
    showProductModal = signal(false);
    searchQuery = signal('');
    parts = signal<import('../../features/repairs/domain/entities/repair.entity').RepairPart[]>([]);
    images = signal<string[]>([]);

    // Reactive search streams
    private productSearch$ = new Subject<string>();
    private clientSearch$ = new Subject<string>();

    // This will be triggered whenever searchQuery changes from UI
    onSearchChange(query: string) {
        this.productSearch$.next(query);
    }

    private setupSearchStreams() {
        // Product Search Stream
        this.productSearch$.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(query => {
                const q = query.trim();
                if (!q) {
                    return from(this.productService.getProductsPaginated({ _per_page: 20 }));
                }
                if (q.length < 2) return of({ data: [] });
                
                this.searchingProducts.set(true);
                return from(this.productService.getProductsPaginated({ q, _per_page: 20 })).pipe(
                    catchError(err => {
                        console.error('Error searching products', err);
                        return of({ data: [] });
                    }),
                    finalize(() => this.searchingProducts.set(false))
                );
            })
        ).subscribe(response => {
            this.filteredProducts.set(response.data || []);
            this.searchingProducts.set(false);
        });

        // Client Search Stream
        this.clientSearch$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(query => {
                const q = query.trim();
                if (q.length < 2) return of([]);
                
                return from(this.customerService.searchClients(q)).pipe(
                    catchError(err => {
                        console.error('Error searching clients', err);
                        return of([]);
                    })
                );
            })
        ).subscribe(data => {
            if (data) {
                this.clients = data.map((c: any) => this.clientView(c)) as any[];
            }
        });
    }

    searchingProducts = signal(false);
    filteredProducts = signal<any[]>([]);

    async loadInitialProducts() {
        this.productSearch$.next('');
    }

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);
    company = signal<any>(null); // Company settings are quite dynamic, can keep any or define interface
    uploadingImages = signal(false);
    clients: any[] = [];

    public missingBranch = computed(() => {
        // SuperAdmins are never 'missing' a branch (fall back to Central)
        if (this.auth.isSuperAdmin()) return false; 
        return !this.branchService.currentBranchId();
    });
    
    async loadInitialClients() {
        try {
            const data = await this.customerService.getRecentClients();
            if (data) {
                this.clients = data.map((c: any) => this.clientView(c)) as any[];
            }
        } catch (e) {
            console.error('Error loading clients', e);
        }
    }

    private setupForm() {
        this.repairForm = this.fb.group({
            customer_id: [''],
            customer_name: ['', [Validators.required, Validators.minLength(3)]],
            customer_phone: ['', [Validators.required]],
            customer_email: ['', [Validators.email]],
            customer_dni: [''],
            device_model: ['', [Validators.required]],
            device_type: ['smartphone'],
            device_brand: ['generic'],
            imei: [''],
            issue_description: ['', [Validators.required]],
            current_status_id: [RepairStatus.PENDING_DIAGNOSIS],
            estimated_cost: [0],
            final_cost: [0],
            technician_notes: [''],
            checklist: this.fb.group({
                charger: [false],
                battery: [false],
                chip: [false],
                sd: [false],
                case: [false]
            }),
            security_pin: [''],
            security_pattern: [''],
            device_passcode: [''],
            deposit_amount: [0],
            technical_labor_cost: [0],
            technical_report: [''],
            upsell_vidrio: [false],
            tracking_code: [''],
            repair_number: [0]
        });
    }

    onSelectClient(clientName: string) {
        this.clientSearch$.next(clientName);

        const client = this.clients.find((c: any) => c.displayName === clientName) as any;
        if (client) {
            this.repairForm.patchValue({
                customer_id: client.id, 
                customer_name: client.displayName,
                customer_phone: client.phone,
                customer_email: client.email,
                customer_dni: client.dni
            });
        } else {
            this.repairForm.get('customer_name')?.setValue(clientName);
        }
    }

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.setupForm();
        this.setupSearchStreams();
        
        await Promise.all([
            this.loadCompanySettings(),
            this.loadInitialClients(),
            this.id ? this.loadRepair() : Promise.resolve()
        ]);
        
        this.loadInitialProducts();
        this.loading.set(false);
    }

    async openProductModal() {
        this.showProductModal.set(true);
        if (this.filteredProducts().length === 0) {
            await this.loadInitialProducts();
        }
    }

    async onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = input.files;
        if (!files || files.length === 0) return;

        this.uploadingImages.set(true);
        const uploadedUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);
                if (file) {
                    const url = await this.repairService.uploadImage(file);
                    uploadedUrls.push(url);
                }
            }

            const currentImages = this.images();
            this.images.set([...currentImages, ...uploadedUrls]);
            this.notificationService.showSuccess('Imágenes subidas correctamente.');
        } catch (e: unknown) {
            console.error('Error uploading images:', e);
            const message = e instanceof Error ? e.message : 'Unknown error';
            this.notificationService.showError('Error al subir imágenes: ' + message);
        } finally {
            this.uploadingImages.set(false);
            // Clear input
            input.value = '';
        }
    }

    removeImage(index: number) {
        this.images.update(imgs => imgs.filter((_, i) => i !== index));
    }

    async loadCompanySettings() {
        try {
            const branchId = this.branchService.getCurrentBranchId(); 
            const data = await this.companyService.getSettings(branchId || undefined);
            if (data) {
                this.company.set(data);
            }
        } catch (error) {
            console.error('Error loading company settings', error);
        }
    }

    addPart(product: any) {
        const newPart = this.repairCalculator.buildNewPart(product, this.id || '');
        this.parts.update(p => [...p, newPart]);
        this.calculateFinalCost();
    }

    removePart(index: number) {
        this.parts.update(p => p.filter((_, i) => i !== index));
        this.calculateFinalCost();
    }

    updateFormField(field: string, value: any) {
        this.repairForm.get(field)?.setValue(value);
        if (field === 'technical_labor_cost') this.calculateFinalCost();
    }

    onPartsListChange(parts: any[]) {
        this.parts.set(parts);
        this.calculateFinalCost();
    }

    onLaborCostChange(value: number) {
        this.updateFormField('technical_labor_cost', value);
    }

    calculateFinalCost() {
        const laborCost = Number(this.repairForm.get('technical_labor_cost')?.value) || 0;
        
        const result = this.repairCalculator.calculateFinancials(this.parts(), laborCost);

        this.parts.set(result.updatedParts);
        this.repairForm.patchValue({
            final_cost: result.finalCost,
            deposit_amount: result.suggestedDeposit
        });
    }

    onEstimatedCostChange(value: number) {
        this.repairForm.patchValue({
            estimated_cost: value,
            deposit_amount: Math.round(value * 0.5)
        });
    }

    async loadRepair() {
        if (!this.id) return;
        try {
            const data = await this.repairService.getById(this.id);
            if (data) {
                this.repairForm.patchValue({
                    customer_id: data.customer_id,
                    customer_name: data.customer_name,
                    customer_phone: data.customer_phone,
                    device_model: data.device_model,
                    device_type: data.device_type,
                    device_brand: data.device_brand,
                    imei: data.imei,
                    issue_description: data.issue_description,
                    current_status_id: data.current_status_id,
                    estimated_cost: data.estimated_cost,
                    final_cost: data.final_cost,
                    technician_notes: data.technician_notes,
                    security_pin: data.security_pin,
                    security_pattern: data.security_pattern,
                    device_passcode: data.device_passcode,
                    deposit_amount: data.deposit_amount,
                    tracking_code: data.tracking_code,
                    repair_number: data.repair_number,
                    technical_labor_cost: data.technical_labor_cost,
                    technical_report: data.technical_report,
                    upsell_vidrio: data.upsell_vidrio
                });

                if (data.checklist) {
                    this.repairForm.get('checklist')?.patchValue(data.checklist);
                }

                this.parts.set(data.parts || []);
                this.images.set(data.images || []);
            }
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error';
            this.error.set('Error cargando reparación: ' + message);
        }
    }

    async save() {
        console.log('🚀 [AdminRepairForm] Iniciando proceso de guardado...');
        this.saving.set(true);
        this.error.set(null);

        try {
            // 1. Resolve branch ID with centralized logic
            console.log('📍 [AdminRepairForm] Resolviendo sucursal...');
            const branchIdActual = await this.branchService.resolveEffectiveBranchId();
            
            if (!branchIdActual) {
                console.error('❌ [AdminRepairForm] No se detectó sucursal activa');
                const errorMsg = 'Sucursal no detectada. Selecciona una en el panel superior.';
                this.notificationService.showError('❌ ' + errorMsg);
                this.error.set(errorMsg);
                this.saving.set(false);
                return;
            }
            console.log('✅ [AdminRepairForm] Sucursal resuelta:', branchIdActual);

            // 2. Validate form
            if (this.repairForm.invalid) {
                const invalidFields: string[] = [];
                const controls = this.repairForm.controls;
                for (const name in controls) {
                    if (controls[name].invalid) {
                        invalidFields.push(`${name}: ${JSON.stringify(controls[name].errors)}`);
                    }
                }
                console.warn('⚠️ [AdminRepairForm] Campos inválidos detected:', invalidFields);
                this.repairForm.markAllAsTouched();
                
                let firstError = 'Por favor, completa los campos obligatorios.';
                const nameControl = this.repairForm.get('customer_name');
                
                if (nameControl?.invalid) {
                    if (nameControl.errors?.['required']) firstError = 'El nombre del cliente es obligatorio.';
                    else if (nameControl.errors?.['minlength']) firstError = `El nombre es demasiado corto (mínimo ${nameControl.errors?.['minlength'].requiredLength} letras).`;
                    else firstError = 'Revisa el nombre del cliente.';
                }
                else if (this.repairForm.get('customer_phone')?.invalid) firstError = 'El teléfono es obligatorio.';
                else if (this.repairForm.get('device_model')?.invalid) firstError = 'El modelo del equipo es obligatorio.';
                else if (this.repairForm.get('issue_description')?.invalid) firstError = 'La falla es obligatoria.';
                
                this.notificationService.showError('⚠️ ' + firstError);
                this.saving.set(false);
                return;
            }

            // 3. Prepare payload
            console.log('📦 [AdminRepairForm] Preparando datos...');
            const formData = this.repairForm.getRawValue();
            const payload = {
                ...formData,
                customer_id: formData.customer_id || null,
                images: this.images(),
                parts: this.parts(),
                branch_id: branchIdActual
            };
            
            console.log('📤 [AdminRepairForm] Enviando a servicio...', this.id ? 'UPDATE' : 'CREATE');
            
            if (this.id) {
                await this.repairService.update(this.id, payload as any);
                this.notificationService.showSuccess('✅ Reparación actualizada correctamente.');
            } else {
                await this.repairService.create(payload as CreateRepairDto);
                this.notificationService.showSuccess('✅ Orden Creada exitosamente.');
                
                try {
                    console.log('📄 [AdminRepairForm] Generando comprobante...');
                    await this.printOrder();
                } catch (pdfErr) {
                    console.error('Error generando PDF automático:', pdfErr);
                }
            }

            console.log('🏁 [AdminRepairForm] Guardado finalizado con éxito. Navegando...');
            this.router.navigate(['/admin/repairs']);
        } catch (e: any) {
            console.error('💥 [AdminRepairForm] Error crítico en save():', e);
            const message = e.message || (e.error?.message) || 'Error desconocido al procesar la solicitud.';
            this.notificationService.showError('Error al guardar: ' + message);
            this.error.set(message);
        } finally {
            this.saving.set(false);
        }
    }

    async printOrder() {
        try {
            this.notificationService.showInfo('Generando documento PDF...');
            // Need a Repair typed object for the service
            const repairData: any = {
                ...this.repairForm.getRawValue(),
                parts: this.parts(),
                images: this.images(),
                id: this.id || 'new'
            };
            await this.repairPdfService.generateOrderPdf(repairData, this.company());
        } catch (e: any) {
            console.error('PDF Error:', e);
            this.notificationService.showError('Error al generar PDF: ' + e.message);
        }
    }

    shareWhatsApp() {
        const data = this.repairForm.getRawValue();
        if (!data.tracking_code) return;

        const customerName = data.customer_name;
        const device = data.device_model;
        const url = this.getTrackingUrl();

        let message = `Hola ${customerName}, tu ${device} está en reparación. Podés seguir el estado en tiempo real aquí: ${url}`;

        if (data.current_status_id === RepairStatus.READY_FOR_PICKUP) {
            // Use configured Google Map Review URL
            const reviewLink = environment.contact.socialMedia.googleMaps;
            message = `Hola ${customerName}, su reparación del ${device} ya está lista. Agradecemos su reseña en el siguiente enlace: ${reviewLink}`;
        }

        const whatsappUrl = `https://wa.me/${data.customer_phone}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    }

    getTrackingUrl(): string {
        const trackingCode = this.repairForm.get('tracking_code')?.value;
        if (!trackingCode) return '';
        return `${window.location.origin}/#/tracking/${trackingCode}`;
    }
}
