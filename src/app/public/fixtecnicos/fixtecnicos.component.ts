import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '@app/features/posts/application/post.service';
import { Post } from '@app/features/posts/domain/entities/post.entity';

@Component({
  selector: 'app-fixtecnicos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './fixtecnicos.component.html',
})
export class FixtecnicosComponent {
  private postService = inject(PostService);

  // Community Feed
  posts = signal<Post[]>([]);
  loadingPosts = signal(true);
  
  // IMEI Checker
  imeiInput = '';
  imeiResult: { status: 'clean' | 'stolen' | 'unknown', message: string } | null = null;
  checkingImei = false;

  async ngOnInit() {
    this.loadCommunityPosts();
  }

  async loadCommunityPosts() {
    try {
      // Reusing existing posts for now, ideally filter by category 'Community'
      const posts = await this.postService.getRecentPosts(5); 
      this.posts.set(posts);
    } catch (err) {
      console.error('Error loading posts', err);
    } finally {
      this.loadingPosts.set(false);
    }
  }

  checkImei() {
    if (!this.imeiInput || this.imeiInput.length < 15) {
      alert('Por favor ingrese un IMEI válido de 15 dígitos.');
      return;
    }

    this.checkingImei = true;
    this.imeiResult = null;

    // Mock IMEI Check
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.8) {
        this.imeiResult = { status: 'stolen', message: 'REPORTADO: Este dispositivo tiene reporte de robo/hurto.' };
      } else {
        this.imeiResult = { status: 'clean', message: 'LIMPIO: El IMEI no presenta reportes negativos.' };
      }
      this.checkingImei = false;
    }, 1500);
  }

  downloadPdf() {
    // Mock download
    const link = document.createElement('a');
    link.href = 'assets/docs/guia-tecnicos.pdf'; // Placeholder
    link.download = 'guia-tecnicos.pdf';
    link.click();
    alert('Descargando Guía para Técnicos...');
  }
}
