import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-admin-brands-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-brands-page.html',
})
export class AdminBrandsPage implements OnInit {
    private auth = inject(AuthService);
    brands = signal<any[]>([]);
    loading = signal(true);

    async ngOnInit() {
        await this.loadBrands();
    }

    async loadBrands() {
        this.loading.set(true);
        const supabase = this.auth.getSupabaseClient();
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .order('name');

        if (data) {
            this.brands.set(data);
        }
        this.loading.set(false);
    }

    async toggleStatus(brand: any) {
        const supabase = this.auth.getSupabaseClient();
        const { error } = await supabase
            .from('brands')
            .update({ is_active: !brand.is_active })
            .eq('id', brand.id);

        if (!error) {
            await this.loadBrands();
        }
    }
}
