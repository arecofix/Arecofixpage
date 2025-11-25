import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BrandRepository } from '@app/features/products/data/repositories/brand.repository';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { NotificationService } from '@app/core/services/notification.service';

@Component({
    selector: 'app-admin-brands-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-brands-page.html',
})
export class AdminBrandsPage implements OnInit {
    private brandRepo = inject(BrandRepository);
    private logger = inject(LoggerService);
    private notification = inject(NotificationService);

    brands = signal<Brand[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadBrands();
    }

    async loadBrands() {
        this.loading.set(true);
        try {
            const brands = await this.brandRepo.findAll({ column: 'name', ascending: true });
            this.brands.set(brands);
        } catch (error) {
            this.logger.error('Failed to load brands', error);
            this.notification.showError('Error al cargar las marcas');
        } finally {
            this.loading.set(false);
        }
    }

    async toggleStatus(brand: Brand) {
        try {
            await this.brandRepo.toggleStatus(brand.id, brand.is_active);
            await this.loadBrands();
            this.notification.showSuccess('Estado actualizado correctamente');
        } catch (error) {
            this.logger.error('Failed to toggle brand status', error);
            this.notification.showError('Error al actualizar el estado');
        }
    }
}
