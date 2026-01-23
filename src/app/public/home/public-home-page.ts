import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PreferencesService } from '../../shared/services/preferences.service';
import { SeoService } from '@app/core/services/seo.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '@app/core/services/auth.service';

import { HOME_CONTENT, HomeContent, QuoteForm } from './public-home.content';

@Component({
  selector: 'app-public-home-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    NgOptimizedImage
  ],
  templateUrl: './public-home-page.html',
  styles: `
    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 2rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHomePage implements OnInit {
  private seoService = inject(SeoService);
  private auth = inject(AuthService);

  whatsappNumber = environment.contact.whatsappNumber;

  // Quote Form State
  quoteModel: QuoteForm = {
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'web',
    budget: 'mid',
    description: '',
    cta: ''
  };
  sendingQuote = false;

  homeContent = HOME_CONTENT;
  content$: Observable<HomeContent>;

  constructor(public preferencesService: PreferencesService) {
    this.content$ = this.preferencesService.language$.pipe(
      map((lang: string) => {
          // Merge missing keys for ES if needed (quick patch logic, ideally strictly typed)
          const key = lang as keyof typeof this.homeContent;
          const content = this.homeContent[key] as any;
          if (lang === 'es') {
             content.coursesTeaser = this.homeContent.es.coursesTeaser || (this.homeContent as any)['es']['coursesTeaser'];
          }
          return content;
      })
    );
  }

  ngOnInit() {
    this.setSEO();
  }

  setSEO() {
    this.seoService.setPageData(
      'Soluciones de Software & Consultoría IT',
      'Expertos en desarrollo de software a medida, aplicaciones móviles y transformación digital. Consultoría IT y servicio técnico especializado en Marcos Paz.',
      'assets/img/hero-illustration.svg'
    );
  }


  scrollToSection(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  async sendQuote() {
    if (!this.quoteModel.name || !this.quoteModel.email || !this.quoteModel.description) {
      alert('Por favor completa los campos principales.');
      return;
    }

    this.sendingQuote = true;
    try {
      const supabase = this.auth.getSupabaseClient();

      await supabase.from('contact_messages').insert({
        name: this.quoteModel.name,
        email: this.quoteModel.email,
        phone: this.quoteModel.phone,
        subject: `Presupuesto IT: ${this.quoteModel.projectType} - ${this.quoteModel.company}`,
        message: `Presupuesto: ${this.quoteModel.budget}\nDescripción: ${this.quoteModel.description}`,
        is_read: false
      });

      alert('Solicitud enviada. Nos pondremos en contacto pronto.');
      // Reset form
      this.quoteModel = { ...this.quoteModel, name: '', email: '', phone: '', company: '', description: '' };
    } catch (error) {
      console.error(error);
      alert('Error al enviar. Por favor intenta por WhatsApp.');
      const text = `Hola, quiero cotizar un proyecto de ${this.quoteModel.projectType}. Mi presupuesto es ${this.quoteModel.budget}.`;
      window.open(`https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
    } finally {
      this.sendingQuote = false;
    }
  }
}