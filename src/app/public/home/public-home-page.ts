import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PreferencesService } from '../../shared/services/preferences.service';
import { SeoService } from '../../shared/services/seo.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '@app/core/services/auth.service';

import { HOME_CONTENT, HomeContent, QuoteForm } from './public-home.content';

@Component({
  selector: 'app-public-home-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule
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
    description: ''
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
    this.seoService.setSeoData({
      title: 'Servicio Técnico de Celulares en Marcos Paz | Arecofix Software Factory',
      description: 'Líderes en reparacion de celulares en Marcos Paz. Realizamos arreglo de celulares, cambios de pantalla, baterías y software. Servicio técnico especializado con garantía.',
      keywords: 'servicio tecnico de celulares en marcos paz, reparacion de celulares en marcos paz, arreglo de celulares en marcos paz, cambio de pantalla, cambio de bateria, software factory, desarrollo web',
      ogTitle: 'Servicio Técnico de Celulares en Marcos Paz | Arecofix',
      ogDescription: 'Reparación profesional de celulares. Confía en los expertos en Marcos Paz para el arreglo de tu dispositivo. Solicita tu presupuesto online.',
      ogImage: 'assets/img/services/mobile-repair-og.jpg', // Placeholder, ideally should be a real image
      ogUrl: 'https://arecofix.com.ar/'
    });
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