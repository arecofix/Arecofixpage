import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { CompanyService } from '@app/core/services/company.service';
import { AdminRepairService } from '@app/features/repairs/application/services/admin-repair.service';
import { AdminProductService } from '@app/admin/products/services/admin-product.service';
import { CreateRepairDto, RepairStatus, UpdateRepairDto } from '@app/features/repairs/domain/entities/repair.entity';
import { environment } from '@env/environment';
import { QRCodeComponent } from 'angularx-qrcode';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    private productService = inject(AdminProductService);

    id: string | null = null;
    date = new Date();
    
    // Initial form state matching entity structure
    initialFormState = {
        customer_name: '',
        customer_phone: '',
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
        device_passcode: '', // New field
        deposit_amount: 0,
        tracking_code: '',
        repair_number: 0,
        images: [] as string[],
        technical_labor_cost: 0, // New field
        technical_report: '', // New field
        parts: [] as any[] // New field for RepairPart
    };

    form = signal({ ...this.initialFormState });
    availableProducts = signal<any[]>([]); // To select parts from
    searchQuery = signal('');
    filteredProducts = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        const products = this.availableProducts();
        if (!query) return products;
        return products.filter(p => p.name.toLowerCase().includes(query));
    });
    showProductModal = signal(false);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        await this.loadCompanySettings();
        await this.loadProducts(); // For parts selection
        if (this.id) {
            await this.loadRepair();
        }
        this.loading.set(false);
    }

    loading = signal(true);
    saving = signal(false);
    error = signal<string | null>(null);
    company = signal<any>(null);
    uploadingImages = signal(false);

    async loadProducts() {
        try {
            const products = await this.productService.getProducts();
            this.availableProducts.set(products);
            this.showProductModal.set(true);
        } catch (e: unknown) {
            console.error('Error loading products:', e);
            this.error.set('Error al cargar repuestos sugeridos');
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

    addPart(product: any) {
        this.form.update(f => {
            const parts = [...f.parts];
            parts.push({
                product_id: product.id,
                name: product.name, // For UI display
                quantity: 1,
                unit_price_at_time: product.price,
                cost_at_time: product.cost || 0 // Assuming product has cost
            });
            return { ...f, parts };
        });
        this.calculateFinalCost();
    }

    removePart(index: number) {
        this.form.update(f => {
            const parts = [...f.parts];
            parts.splice(index, 1);
            return { ...f, parts };
        });
        this.calculateFinalCost();
    }

    calculateFinalCost() {
        this.form.update(f => {
            const partsTotal = f.parts.reduce((acc, p) => acc + (p.unit_price_at_time * p.quantity), 0);
            return {
                ...f,
                final_cost: (f.technical_labor_cost || 0) + partsTotal
            };
        });
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
                    device_passcode: data.device_passcode || '',
                    deposit_amount: data.deposit_amount || 0,
                    tracking_code: data.tracking_code,
                    repair_number: data.repair_number || 0,
                    images: data.images || [],
                    technical_labor_cost: data.technical_labor_cost || 0,
                    technical_report: data.technical_report || '',
                    parts: data.parts || []
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
            
            const payload: any = {
                ...formData,
                parts: formData.parts.map((p: any) => ({
                    product_id: p.product_id,
                    quantity: p.quantity,
                    unit_price_at_time: p.unit_price_at_time,
                    cost_at_time: p.cost_at_time
                }))
            };


            if (this.id) {
                await this.repairService.update(this.id, payload);
            } else {
                await this.repairService.create(payload);
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
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const formData = this.form();
        const companyData = this.company();
        const primaryColor = companyData?.branding_settings?.primary_color || '#16a34a';

        // Helper string to hex color array
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : [22, 163, 74];
        };
        const colorArray = hexToRgb(primaryColor);

        // Header Background
        doc.setFillColor(243, 244, 246);
        doc.rect(0, 0, 210, 45, 'F');

        // Company Name
        doc.setFontSize(24);
        doc.setTextColor(colorArray[0], colorArray[1], colorArray[2]);
        doc.text(companyData?.name || 'Arecofix', 15, 20);

        // Standard Text Color
        doc.setTextColor(55, 65, 81);
        
        doc.setFontSize(10);
        doc.text(companyData?.address || 'Dirección de la Sucursal', 15, 28);
        doc.text(`Tel: ${companyData?.phone || 'Sin Teléfono'}`, 15, 34);

        // Ticket Info (Right side)
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`ORDEN TÉCNICA # ${formData.repair_number || 'S/N'}`, 120, 20);
        
        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 120, 28);
        doc.text(`Código de Seguimiento:`, 120, 34);
        doc.setFontSize(11);
        doc.setTextColor(colorArray[0], colorArray[1], colorArray[2]);
        doc.text(`${formData.tracking_code || '---'}`, 162, 34);

        // Customer Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text('Datos del Cliente', 15, 55);
        doc.line(15, 57, 95, 57);
        doc.setFontSize(10);
        doc.text(`Nombre: ${formData.customer_name}`, 15, 65);
        doc.text(`Teléfono: ${formData.customer_phone || 'No registrado'}`, 15, 72);

        // Device Details
        doc.setFontSize(12);
        doc.text('Detalles del Equipo', 110, 55);
        doc.line(110, 57, 195, 57);
        doc.setFontSize(10);
        doc.text(`Modelo: ${formData.device_model}`, 110, 65);
        doc.text(`IMEI/Serie: ${formData.imei || 'Sin declarar'}`, 110, 72);
        doc.text(`Tipo/Marca: ${formData.device_type} / ${formData.device_brand}`, 110, 79);

        // Security & Checklist Box
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(15, 87, 180, 25, 3, 3, 'FD');
        doc.text(`Seguridad - PIN: ${formData.security_pin || 'Ninguno'} | Patrón: ${formData.security_pattern || 'Ninguno'} | Passcode: ${formData.device_passcode || 'No'}`, 20, 95);
        
        const chk = formData.checklist;
        doc.text(`Accesorios: [${chk.charger ? 'X' : ' '}] Cargador  [${chk.battery ? 'X' : ' '}] Batería  [${chk.chip ? 'X' : ' '}] Chip  [${chk.sd ? 'X' : ' '}] SD  [${chk.case ? 'X' : ' '}] Funda`, 20, 105);

        // Reason / Fault
        doc.setFontSize(12);
        doc.text('Motivo de Ingreso / Falla Reportada', 15, 122);
        doc.setFontSize(10);
        const splitDescription = doc.splitTextToSize(formData.issue_description || 'Sin detalles.', 180);
        doc.text(splitDescription, 15, 130);

        // Generate Table for Parts
        const defaultTableY = splitDescription.length * 5 + 135;
        
        const tableData = formData.parts.map(p => [
            p.name,
            p.quantity.toString(),
            `$ ${p.unit_price_at_time.toLocaleString('es-AR')}`,
            `$ ${(p.unit_price_at_time * p.quantity).toLocaleString('es-AR')}`
        ]);

        if (formData.technical_labor_cost > 0) {
            tableData.push(['Mano de Obra Técnica', '1', `$ ${formData.technical_labor_cost.toLocaleString('es-AR')}`, `$ ${formData.technical_labor_cost.toLocaleString('es-AR')}`]);
        }

        if (tableData.length > 0) {
            autoTable(doc, {
                startY: defaultTableY,
                head: [['Detalle', 'Cant', 'Precio Unitario', 'Subtotal']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: colorArray as [number, number, number] },
                margin: { left: 15, right: 15 }
            });
        }

        const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : defaultTableY + 10;

        // Financial Totals
        doc.setFontSize(11);
        doc.text(`Presupuesto Inicial Estimado: $ ${formData.estimated_cost?.toLocaleString('es-AR') || '0'}`, 110, finalY + 10);
        doc.text(`Seña / Adelanto Pagado: $ ${formData.deposit_amount?.toLocaleString('es-AR') || '0'}`, 110, finalY + 17);
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`RESTANTE A ABONAR: $ ${(formData.final_cost - (formData.deposit_amount || 0)).toLocaleString('es-AR')}`, 110, finalY + 27);

        // Signatures
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.line(25, finalY + 50, 85, finalY + 50);
        doc.text('Firma y Aclaración Cliente', 33, finalY + 56);

        doc.line(125, finalY + 50, 185, finalY + 50);
        doc.text('Firma Técnico / Local', 135, finalY + 56);

        // Terms and conditions
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        const terminos = 'Términos y Condiciones: Pasados los 30 días de notificada la reparación, la empresa cobrará resguardo diario. Pasados los 90 días el equipo se considerará abandonado perdiendo el cliente todo derecho a reclamo y pasando a ser propiedad del local para cubrir costos. Todo presupuesto no aceptado tiene cargo de revisión técnica. NO SE ENTREGAN EQUIPOS SIN ESTA ORDEN.';
        doc.text(doc.splitTextToSize(terminos, 180), 15, 275);

        // URL tracking (Footer)
        doc.setFontSize(9);
        doc.text(`Sigue el estado de tu equipo online en: ${window.location.origin}/#/tracking/${formData.tracking_code}`, 15, 290);

        // Save PDF
        doc.save(`Arecofix_Orden_${formData.repair_number || 'S-N'}_${formData.customer_name.replace(' ', '_')}.pdf`);
    }

    shareWhatsApp() {
        if (!this.form().tracking_code) return;

        const customerName = this.form().customer_name;
        const device = this.form().device_model;
        const url = this.getTrackingUrl();

        let message = `Hola ${customerName}, tu ${device} está en reparación. Podés seguir el estado en tiempo real aquí: ${url}`;

        if (this.form().current_status_id === RepairStatus.READY_FOR_PICKUP) {
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
