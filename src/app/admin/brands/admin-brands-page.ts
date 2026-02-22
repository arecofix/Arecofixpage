import { Component, inject, OnInit, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { BrandRepository } from '@app/features/products/domain/repositories/brand.repository';
import { Brand } from '@app/features/products/domain/entities/brand.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { NotificationService } from '@app/core/services/notification.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-admin-brands-page',
    standalone: true,
    imports: [RouterLink],
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
            const brands = await firstValueFrom(this.brandRepo.getAll({ column: 'name', ascending: true }));
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
            await firstValueFrom(this.brandRepo.update(brand.id, { is_active: !brand.is_active }));
            await this.loadBrands();
            this.notification.showSuccess('Estado actualizado correctamente');
        } catch (error) {
            this.logger.error('Failed to toggle brand status', error);
            this.notification.showError('Error al actualizar el estado');
        }
    }
}
