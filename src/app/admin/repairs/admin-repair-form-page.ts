import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { CompanyService } from '@app/core/services/company.service';
import { AdminRepairService } from '@app/features/repairs/application/services/admin-repair.service';
import { CreateRepairDto, RepairStatus, UpdateRepairDto } from '@app/features/repairs/domain/entities/repair.entity';
import { environment } from '@env/environment';

import { QRCodeComponent } from 'angularx-qrcode';

@Component({
    selector: 'app-admin-repair-form-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, QRCodeComponent],
    templateUrl: './admin-repair-form-page.html',
})
export class AdminRepairFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private companyService = inject(CompanyService);
    private repairService = inject(AdminRepairService);

    id: string | null = null;
    date = new Date();
    
    // Initial form state matching entity structure
    initialFormState = {
        customer_name: '',
        customer_phone: '',
        device_model: '',
        device_type: 'smartphone', // Default
        device_brand: 'generic', // Default
        imei: '',
        issue_description: '',
        current_status_id: RepairStatus.PENDING,
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
        deposit_amount: 0,
        tracking_code: '',
        repair_number: 0,
        images: [] as string[]
    };

    form = signal({ ...this.initialFormState });

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);
    company = signal<any>(null);
    uploadingImages = signal(false);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        await this.loadCompanySettings();
        if (this.id) {
            await this.loadRepair();
        }
        this.loading.set(false);
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

            this.form.update(f => ({
                ...f,
                images: [...f.images, ...uploadedUrls]
            }));
        } catch (e: unknown) {
            console.error('Error uploading images:', e);
            const message = e instanceof Error ? e.message : 'Unknown error';
            this.error.set('Error al subir imágenes: ' + message);
        } finally {
            this.uploadingImages.set(false);
            // Clear input
            input.value = '';
        }
    }

    removeImage(index: number) {
        this.form.update(f => {
            const newImages = [...f.images];
            newImages.splice(index, 1);
            return { ...f, images: newImages };
        });
    }

    async loadCompanySettings() {
        try {
            const data = await this.companyService.getSettings();
            if (data) {
                this.company.set(data);
            }
        } catch (error) {
            console.error('Error loading company settings', error);
        }
    }

    async loadRepair() {
        if (!this.id) return;
        try {
            const data = await this.repairService.getById(this.id);
            if (data) {
                this.form.set({
                    customer_name: data.customer_name || '',
                    customer_phone: data.customer_phone || '',
                    device_model: data.device_model || '',
                    device_type: data.device_type || 'smartphone',
                    device_brand: data.device_brand || 'generic',
                    imei: data.imei || '',
                    issue_description: data.issue_description || '',
                    current_status_id: data.current_status_id,
                    estimated_cost: data.estimated_cost || 0,
                    final_cost: data.final_cost || 0,
                    technician_notes: data.technician_notes || '',
                    checklist: data.checklist || this.initialFormState.checklist,
                    security_pin: data.security_pin || '',
                    security_pattern: data.security_pattern || '',
                    deposit_amount: data.deposit_amount || 0,
                    tracking_code: data.tracking_code,
                    repair_number: data.repair_number || 0,
                    images: data.images || []
                });
            }
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error';
            this.error.set('Error cargando reparación: ' + message);
        }
    }

    async save() {
        this.saving.set(true);
        this.error.set(null);
        
        try {
            const formData = this.form();
            
            // Map form data to DTO
            // Using logic to extend dto with necessary fields that might not be in CreateRepairDto strict definition but are handled by service/repo logic
            const baseDto: CreateRepairDto = {
                customer_name: formData.customer_name,
                customer_phone: formData.customer_phone,
                device_model: formData.device_model,
                device_type: formData.device_type,
                device_brand: formData.device_brand,
                imei: formData.imei,
                issue_description: formData.issue_description,
                estimated_cost: formData.estimated_cost,
                notes: '', // Optional notes field
                images: formData.images,
                checklist: formData.checklist,
                security_pin: formData.security_pin,
                security_pattern: formData.security_pattern,
            };

            // We augment the DTO with status and final_cost which are handled by the service/repo
            const extendedDto = {
                ...baseDto,
                current_status_id: formData.current_status_id,
                final_cost: formData.final_cost,
                technician_notes: formData.technician_notes,
                deposit_amount: formData.deposit_amount,
                tracking_code: formData.tracking_code,
            };

            if (this.id) {
                await this.repairService.update(this.id, extendedDto as UpdateRepairDto);
            } else {
                await this.repairService.create(extendedDto);
            }
            this.router.navigate(['/admin/repairs']);
        } catch (e: any) {
            console.error('Error saving repair:', e);
            const message = e.message || e.error_description || (e instanceof Error ? e.message : 'Unknown error');
            this.error.set(message);
        } finally {
            this.saving.set(false);
        }
    }

    printOrder() {
        document.body.classList.add('printing-repair-order');
        setTimeout(() => {
            window.print();
            document.body.classList.remove('printing-repair-order');
        }, 100);
    }

    shareWhatsApp() {
        if (!this.form().tracking_code) return;

        const customerName = this.form().customer_name;
        const device = this.form().device_model;
        const url = this.getTrackingUrl();

        let message = `Hola ${customerName}, tu ${device} está en reparación. Podés seguir el estado en tiempo real aquí: ${url}`;

        if (this.form().current_status_id === RepairStatus.COMPLETED) {
            // Use configured Google Map Review URL
            const reviewLink = environment.contact.socialMedia.googleMaps;
            message = `Hola ${customerName}, su reparación del ${device} ya está lista. Agradecemos su reseña en el siguiente enlace: ${reviewLink}`;
        }

        const whatsappUrl = `https://wa.me/${this.form().customer_phone}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    }

    getTrackingUrl(): string {
        if (!this.form().tracking_code) return '';
        return `${window.location.origin}/#/tracking/${this.form().tracking_code}`;
    }
}
