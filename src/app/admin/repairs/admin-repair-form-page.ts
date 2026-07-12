import { Component, inject, OnInit, OnDestroy, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, from, catchError, of, finalize, firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { SupabaseService } from '@app/core/services/supabase.service';
import { OfflineSyncService } from '@app/core/services/offline-sync.service';

import { Product } from '@app/features/products/domain/entities/product.entity';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { AdminLayout } from '@app/admin/layout/admin-layout';

interface ClientView extends Partial<UserProfile> {
    displayName: string;
    dni?: string;
}

@Component({
    selector: 'app-admin-repair-form-page',
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './admin-repair-form-page.html',
})
export class AdminRepairFormPage implements OnInit, OnDestroy {
    // Helper interface for UI
    private clientView = (client: UserProfile | Partial<UserProfile>): ClientView => ({
        ...client,
        displayName: client.full_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.email || 'Sin nombre'
    });
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private companyService = inject(CompanyService);
    public branchService = inject(BranchService);
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
    private supabaseService = inject(SupabaseService);
    public offlineSyncService = inject(OfflineSyncService);
    private adminLayout = inject(AdminLayout, { optional: true });
    private destroyRef = inject(DestroyRef);

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
        brand_id: null,
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
        upsell_vidrio: false,
        glass_upsell: false,
        whatsapp_notifications: true,
        costo_repuesto: 0
    };

    // Keep some UI-only signals
    showProductModal = signal(false);

    statusOptions = [
        { id: 1, label: 'Recibido / Pendiente', icon: 'fas fa-clipboard-list', color: 'text-amber-500' },
        { id: 2, label: 'Gestión de Repuestos', icon: 'fas fa-boxes', color: 'text-cyan-500' },
        { id: 3, label: 'En Reparación', icon: 'fas fa-tools', color: 'text-blue-500' },
        { id: 4, label: 'Control de Calidad', icon: 'fas fa-clipboard-check', color: 'text-indigo-500' },
        { id: 5, label: 'Listo para Entregar', icon: 'fas fa-check-circle', color: 'text-green-500' },
        { id: 6, label: 'Entregado', icon: 'fas fa-box-open', color: 'text-slate-500' },
        { id: 7, label: 'Cancelado', icon: 'fas fa-times-circle', color: 'text-rose-500' }
    ];

    readonly TAX_RATE = 0.21;
    searchQuery = signal('');
    parts = signal<import('../../features/repairs/domain/entities/repair.entity').RepairPart[]>([]);
    images = signal<string[]>([]);
    brands = signal<{id: string, name: string}[]>([]);

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
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(response => {
            this.filteredProducts.set((response.data || []) as unknown as Product[]);
            this.searchingProducts.set(false);
        });

        // Client Search Stream
        this.clientSearch$.pipe(
            debounceTime(300),
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
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(data => {
            if (data) {
                this.clients.set(data.map(c => this.clientView(c as any)));
            }
        });
    }

    searchingProducts = signal(false);
    filteredProducts = signal<Product[]>([]);

    async loadInitialProducts() {
        this.productSearch$.next('');
    }

    saving = signal<boolean>(false);
    error = signal<string | null>(null);
    loading = signal<boolean>(true);
    company = signal<unknown>(null);
    // Removed duplicate properties
    uploadingImages = signal(false);
    clients = signal<ClientView[]>([]);

    public missingBranch = computed(() => {
        // SuperAdmins are never 'missing' a branch (fall back to Central)
        if (this.auth.isSuperAdmin()) return false; 
        return !this.branchService.currentBranchId();
    });
    
    async loadInitialClients() {
        try {
            const data = await this.customerService.getRecentClients();
            if (data) {
                this.clients.set(data.map(c => this.clientView(c as any)));
            }
        } catch (e) {
            console.error('Error loading clients', e);
        }
    }

    private setupForm() {
        this.repairForm = this.fb.group({
            customer_id: [''],
            customer_name: ['', [Validators.required, Validators.minLength(3)]],
            customer_phone: [''],
            customer_email: ['', [Validators.email]],
            customer_dni: [''],
            device_model: ['', [Validators.required]],
            device_type: ['smartphone'],
            brand_id: [null],
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
            glass_upsell: [false],
            whatsapp_notifications: [true],
            costo_repuesto: [0],
            tracking_code: [''],
            repair_number: [0],
            payment_method: ['efectivo'],
            warranty: [''],
            supplier: ['']
        });
    }

    onSelectClient(clientName: string) {
        this.clientSearch$.next(clientName);

        const client = this.clients().find(c => c.displayName === clientName);
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
        if (this.adminLayout) {
            this.adminLayout.isMainMenuOpen.set(false);
        }

        this.id = this.route.snapshot.paramMap.get('id');
        this.setupForm();
        this.setupSearchStreams();
        
        await Promise.all([
            this.loadCompanySettings(),
            this.loadInitialClients(),
            this.loadBrands(),
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

    async loadBrands() {
        try {
            const { data } = await this.supabaseService.getClient().from('brands').select('id, name').order('name');
            if (data) {
                this.brands.set(data);
            }
        } catch (error) {
            console.error('Error loading brands', error);
        }
    }

    addPart(product: Product) {
        const newPart = this.repairCalculator.buildNewPart(product, this.id || '');
        this.parts.update(p => [...p, newPart]);
        this.calculateFinalCost();
    }

    async addManualProduct() {
        const manualName = this.searchQuery().trim() || 'Repuesto Genérico';
        this.saving.set(true);
        
        try {
            const branchIdActual = await this.branchService.resolveEffectiveBranchId();
            const newId = crypto.randomUUID();
            
            const genericProduct: Product = {
                id: newId,
                name: manualName,
                price: 0,
                stock: 9999, // Ensures it's not disabled
                unit_cost_at_time: 0,
                is_active: true,
                is_global: false,
                sku: '',
                barcode: '',
                branch_id: branchIdActual,
                slug: 'manual-' + newId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            } as Product;
            
            // Register it in the DB so repair_parts_used can link to it (uuid format & foreign key)
            await this.productService.createProduct(genericProduct);
            
            this.addPart(genericProduct);
            this.showProductModal.set(false);
            this.searchQuery.set('');
        } catch (error) {
            console.error('Error creating manual product:', error);
            this.notificationService.showError('Error al crear el repuesto manual en la base de datos');
        } finally {
            this.saving.set(false);
        }
    }

    removePart(index: number) {
        this.parts.update(p => p.filter((_, i) => i !== index));
        this.calculateFinalCost();
    }

    updateFormField(field: string, value: unknown) {
        this.repairForm.get(field)?.setValue(value);
        this.repairForm.get(field)?.markAsDirty();
        if (field === 'technical_labor_cost') this.calculateFinalCost();
    }

    onPartsListChange(parts: import('../../features/repairs/domain/entities/repair.entity').RepairPart[]) {
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

    onFinalCostChange(value: number) {
        this.repairForm.patchValue({
            final_cost: value,
            technical_labor_cost: Math.round(value * 0.5),
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
                    brand_id: (data as any).brand_id || null,
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
                    upsell_vidrio: data.upsell_vidrio,
                    glass_upsell: data.glass_upsell,
                    whatsapp_notifications: data.whatsapp_notifications,
                    costo_repuesto: data.costo_repuesto,
                    payment_method: (data as any).payment_method || 'efectivo',
                    warranty: (data as any).warranty || '',
                    supplier: (data as any).supplier || ''
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

    syncOfflineRepairs() {
        this.offlineSyncService.syncAll().then(() => {
            this.notificationService.showSuccess(`¡Órdenes sincronizadas con éxito!`);
        }).catch(err => {
            this.notificationService.showError(`Error al sincronizar.`);
        });
    }

    openNotifyModal() {
        this.shareWhatsApp();
    }
    
    async save() {
        console.log('🚀 [AdminRepairForm] Iniciando proceso de guardado...');
        (window as any).saveCalled = true;
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
                else if (this.repairForm.get('device_model')?.invalid) firstError = 'El modelo del equipo es obligatorio.';
                else if (this.repairForm.get('issue_description')?.invalid) firstError = 'La falla es obligatoria.';
                
                // Scroll to the first invalid element
                setTimeout(() => {
                    const firstInvalidElement = document.querySelector('input.ng-invalid, select.ng-invalid, textarea.ng-invalid');
                    if (firstInvalidElement) {
                        firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Add a small shake animation or highlight if needed, or just let the red border do its job
                        (firstInvalidElement as HTMLElement).focus();
                    }
                }, 100);

                this.notificationService.showError('⚠️ ' + firstError);
                this.saving.set(false);
                return;
            }

            // 3. Prepare payload
            console.log('📦 [AdminRepairForm] Preparando datos...');
            const rawData = this.repairForm.getRawValue();
            
            // Destructuramos para extraer device_type que no existe en DB, 
            // brand_id se pasará directo al payload.
            const { device_type, ...validFormData } = rawData;

            const payload = {
                ...validFormData,
                customer_id: validFormData.customer_id || null,
                client_id: validFormData.customer_id || validFormData.client_id || null,
                images: this.images(),
                parts: this.parts(),
                branch_id: branchIdActual
            };
            
            console.log('📤 [AdminRepairForm] Enviando a servicio...', this.id ? 'UPDATE' : 'CREATE');
            
            const isOffline = !navigator.onLine || (window as any).forceOffline;
            if (!this.id && typeof navigator !== 'undefined' && isOffline) {
                console.log('📶 [AdminRepairForm] Sin conexión, guardando offline...');
                this.offlineSyncService.saveOfflineRepair(payload);
                this.notificationService.showWarning('Guardado localmente. Se sincronizará cuando haya conexión.');
                this.router.navigate(['/admin/repairs']);
                this.saving.set(false);
                return;
            }

            if (this.id) {
                await this.repairService.update(this.id, payload as unknown as Partial<import('../../features/repairs/domain/entities/repair.entity').Repair>);
                this.notificationService.showSuccess('✅ Reparación actualizada correctamente.');
            } else {
                const createdRepair = await this.repairService.create(payload as CreateRepairDto);
                this.notificationService.showSuccess('✅ Orden Creada exitosamente.');
                
                // Set the tracking code so shareWhatsApp and printOrder can use it
                if (createdRepair && createdRepair.tracking_code) {
                    this.repairForm.patchValue({ tracking_code: createdRepair.tracking_code });
                }
                
                try {
                    console.log('📄 [AdminRepairForm] Generando comprobante...');
                    await this.printOrder();
                } catch (pdfErr) {
                    console.error('Error generando PDF automático:', pdfErr);
                }

                // WhatsApp Auto-Trigger
                if (payload.customer_phone && payload.whatsapp_notifications !== false) {
                    this.shareWhatsApp();
                }
            }

            console.log('🏁 [AdminRepairForm] Guardado finalizado con éxito. Navegando...');
            this.router.navigate(['/admin/repairs']);
        } catch (e: unknown) {
            console.error('💥 [AdminRepairForm] Error crítico en save():', e);
            const message = e instanceof Error ? e.message : ((e as { error?: { message?: string } })?.error?.message) || 'Error desconocido al procesar la solicitud.';
            this.notificationService.showError('Error al guardar: ' + message);
            this.error.set(message);
        } finally {
            this.saving.set(false);
        }
    }

    async printOrder() {
        try {
            this.notificationService.showInfo('Generando documento PDF...');
            const rawData = this.repairForm.getRawValue();
            
            let brandName = 'No especificada';
            if (rawData.brand_id) {
                const brand = this.brands().find(b => b.id === rawData.brand_id);
                if (brand) brandName = brand.name;
            }

            // Need a Repair typed object for the service
            const repairData: any = {
                ...rawData,
                brand_name: brandName,
                parts: this.parts(),
                images: this.images(),
                id: this.id || 'new'
            };
            await this.repairPdfService.generateOrderPdf(repairData as import('../../features/repairs/domain/entities/repair.entity').Repair, this.company());
        } catch (e: unknown) {
            console.error('PDF Error:', e);
            const message = e instanceof Error ? e.message : 'Error desconocido al generar PDF';
            this.notificationService.showError('Error al generar PDF: ' + message);
        }
    }

    shareWhatsApp() {
        const data = this.repairForm.getRawValue();
        if (!data.customer_phone) {
            this.notificationService.showWarning('El cliente no tiene teléfono cargado.');
            return;
        }
        if (!data.tracking_code) {
            this.notificationService.showWarning('Falta el código de seguimiento. Guardá la orden primero.');
            return;
        }

        const customerName = data.customer_name || 'Cliente';
        const device = data.device_model || 'Equipo';
        const url = this.getTrackingUrl();
        const cost = data.final_cost || data.estimated_cost || 0;
        const statusId = Number(data.current_status_id);

        let message = '';
        const reviewUrl = environment.contact.socialMedia.googleMaps;

        switch (statusId) {
            case RepairStatus.PENDING_DIAGNOSIS:
                message = `📦 *Arecofix - Equipo Recibido*\n\nHola ${customerName}, recibimos tu ${device}. Podés seguir el estado de tu reparación en tiempo real aquí:\n\n🔗 ${url}\n\n¡Gracias por elegirnos!`;
                break;
            case RepairStatus.SUPPLY_MANAGEMENT:
                message = `⏳ *Arecofix - Presupuesto / Repuestos*\n\nHola ${customerName}, tenemos novedades sobre el presupuesto o repuestos para tu ${device}. Podés ver los detalles aquí:\n\n🔗 ${url}\n\nPor favor comunícate con nosotros para coordinar. ¡Gracias!`;
                break;
            case RepairStatus.IN_PROGRESS:
                message = `⚙️ *Arecofix - En Reparación*\n\nHola ${customerName}, te informamos que tu ${device} ya se encuentra en servicio técnico. Podés seguir el progreso en tiempo real aquí:\n\n🔗 ${url}`;
                break;
            case RepairStatus.QUALITY_CONTROL:
                message = `🔍 *Arecofix - Control de Calidad*\n\nHola ${customerName}, tu ${device} está siendo evaluado en el control de calidad final. Seguí el estado aquí:\n\n🔗 ${url}`;
                break;
            case RepairStatus.READY_FOR_PICKUP:
                message = `✅ *Arecofix - ¡Tu equipo está LISTO!*\n\nHola ${customerName}, te avisamos que tu ${device} ya está reparado y listo para retirar. El costo final es de $${cost.toLocaleString('es-AR')}.\n\n📍 Te esperamos en nuestra sucursal. Código de seguimiento: *${data.tracking_code}*\n\nPodés ver la orden completa aquí:\n🔗 ${url}`;
                break;
            case RepairStatus.DELIVERED:
                message = `🌟 *Arecofix - ¡Equipo Entregado!*\n\nHola ${customerName}, fue un gusto ayudarte con la reparación de tu ${device}. Si estás conforme con nuestro servicio, nos ayudaría mucho que nos dejes una reseña en Google:\n\n⭐⭐⭐⭐⭐\n🔗 ${reviewUrl}\n\n¡Muchas gracias!`;
                break;
            case RepairStatus.CANCELLED:
                message = `❌ *Arecofix - Reparación Cancelada*\n\nHola ${customerName}, te informamos que la orden para tu ${device} fue cancelada. Podés ver los detalles aquí:\n\n🔗 ${url}`;
                break;
            default:
                message = `Hola ${customerName}, tu ${device} está en reparación. Podés seguir el estado en tiempo real aquí: ${url}`;
                break;
        }

        const whatsappUrl = `https://wa.me/${data.customer_phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    getTrackingUrl(): string {
        const trackingCode = this.repairForm.get('tracking_code')?.value;
        if (!trackingCode) return '';
        return `${window.location.origin}/tracking/${trackingCode}`;
    }

    ngOnDestroy() {
        if (this.adminLayout) {
            this.adminLayout.isMainMenuOpen.set(true);
        }
    }
}
