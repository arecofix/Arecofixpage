import { Component, inject, OnInit, signal, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { BranchService, Branch } from '@app/core/services/branch.service';
import { Product } from '@app/features/products/domain/entities/product.entity';

@Component({
  selector: 'app-branch-store',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './branch-store.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchStoreComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private branchService = inject(BranchService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  branch = signal<Branch | null>(null);
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const slug = params.get('branchSlug');
      
      if (slug) {
        await this.loadBranchCatalog(slug);
      }
    });
  }

  private async loadBranchCatalog(slug: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const branchData = await this.branchService.getBranchBySlug(slug);
      if (!branchData) {
        // Check if it's a reserved word to provide a better error message
        const reservedSlugs = [
          'admin', 'login', 'register', 'perfil', 'nosotros', 'contacto', 
          'servicios', 'academy', 'checkout', 'posts', 'tracking', 'blog', 
          'portfolio', 'productos', 'categories', 'repuestos', 'gsm', 'fixtecnicos', 'recursos',
          'api', 'static', 'assets'
        ];
        
        if (reservedSlugs.includes(slug.toLowerCase())) {
          this.error.set(`La ruta "/${slug}" es una página del sistema, no una sucursal. Redirigiendo...`);
          // Redirect to the correct page after a short delay
          setTimeout(() => {
            this.router.navigate([`/${slug}`]);
          }, 2000);
        } else {
          this.error.set('La sucursal virtual no existe o se encuentra inactiva.');
        }
        return;
      }
      this.branch.set(branchData);

      // Cargar el catálogo con la lógica de pricing de la sucursal (reventa central + propios)
      const catalog = await this.branchService.getBranchCatalog(branchData.id, branchData.global_markup_percentage);
      this.products.set(catalog);
    } catch (err: any) {
      this.error.set('Ocurrió un error cargando el catálogo: ' + err.message);
    } finally {
      this.loading.set(false);
      this.cdr.markForCheck();
    }
  }
}
