import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { PreferencesService } from '../../shared/services/preferences.service';
import { ContactService } from '@app/core/services/contact.service';
import { NotificationService } from '@app/core/services/notification.service';
import { environment } from '../../../environments/environment';

import {
  HOME_CONTENT,
  HomeContent,
  QuoteOption,
} from './public-home.content';

import { HomeMethodologyComponent } from './components/home-methodology.component';
import { HomePillarsComponent } from './components/home-pillars.component';
import { HomeMetricsComponent } from './components/home-metrics.component';

type StepNumber = 1 | 2 | 3 | 4;

@Component({
  selector: 'app-public-home-page',
  standalone: true,
  imports: [
    RouterModule,
    NgOptimizedImage,
    HomeMethodologyComponent,
    HomePillarsComponent,
    HomeMetricsComponent,
  ],
  templateUrl: './public-home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHomePage {
  private readonly preferences = inject(PreferencesService);
  private readonly contactService = inject(ContactService);
  private readonly notifications = inject(NotificationService);

  readonly whatsappNumber = environment.contact.whatsappNumber;

  readonly content = toSignal(
    this.preferences.language$.pipe(
      map((lang: string): HomeContent => {
        const key: 'en' | 'es' = lang === 'es' ? 'es' : 'en';
        return HOME_CONTENT[key];
      }),
    ),
    { initialValue: HOME_CONTENT.es },
  );

  // ── Multi-step quote form ────────────────────────────
  readonly currentStep = signal<StepNumber>(1);
  readonly selectedProblem = signal<string | null>(null);
  readonly selectedSize = signal<string | null>(null);
  readonly phoneInput = signal<string>('');
  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  selectProblem(value: string): void {
    this.selectedProblem.set(value);
    setTimeout(() => this.currentStep.set(2), 180);
  }

  selectSize(value: string): void {
    this.selectedSize.set(value);
    setTimeout(() => this.currentStep.set(3), 180);
  }

  goBack(): void {
    const step = this.currentStep();
    if (step > 1 && step < 4) {
      this.currentStep.set((step - 1) as StepNumber);
    }
    this.submitError.set(null);
  }

  onPhoneInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.phoneInput.set(value);
    this.submitError.set(null);
  }

  resetForm(): void {
    this.currentStep.set(1);
    this.selectedProblem.set(null);
    this.selectedSize.set(null);
    this.phoneInput.set('');
    this.submitError.set(null);
  }

  async submitQuote(): Promise<void> {
    const phone = this.phoneInput().trim();
    if (!phone || phone.replace(/\D/g, '').length < 6) {
      this.submitError.set('Ingresá un número válido');
      return;
    }

    const problemValue = this.selectedProblem();
    const sizeValue = this.selectedSize();
    if (!problemValue || !sizeValue) {
      this.submitError.set('Faltan datos del proyecto');
      return;
    }

    const content = this.content();
    const problem = content.quote.steps.problemOptions.find(
      (o: QuoteOption) => o.value === problemValue,
    );
    const size = content.quote.steps.sizeOptions.find(
      (o: QuoteOption) => o.value === sizeValue,
    );

    this.isSubmitting.set(true);
    this.submitError.set(null);

    try {
      const result = await this.contactService.createMessage({
        name: `Lead: ${problem?.label ?? problemValue} — ${size?.label ?? sizeValue}`,
        email: `lead-${Date.now()}@arecofix.com.ar`,
        phone,
        subject: `[NUEVO LEAD] ${problem?.label ?? problemValue} · ${size?.label ?? sizeValue} · ${phone}`,
        message:
          `Nuevo lead desde la home.\n\n` +
          `Proyecto: ${problem?.label ?? problemValue}\n` +
          `Tamaño: ${size?.label ?? sizeValue}\n` +
          `WhatsApp: ${phone}\n\n` +
          `Acción: contactar por WhatsApp en las próximas 24h.`,
      });

      if (result?.error) {
        throw new Error(result.error.message);
      }

      this.notifications.showSuccess('Lead enviado. Te contactamos pronto.');
      this.currentStep.set(4);
    } catch (err) {
      console.error('Lead submit error:', err);
      this.submitError.set(content.quote.steps.errorMessage);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}