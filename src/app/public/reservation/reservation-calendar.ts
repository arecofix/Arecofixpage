import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '@app/core/services/contact.service';
import { NotificationService } from '@app/core/services/notification.service';
import { RESERVATION_CONFIG } from './reservation.constants';

interface ReservationStep {
  number: 1 | 2 | 3;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-reservation-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-calendar.html',
  styleUrls: ['./reservation-calendar.css']
})
export class ReservationCalendar implements OnInit {
  private contactService = inject(ContactService);
  private notificationService = inject(NotificationService);
  private document = inject(DOCUMENT);

  // ===== CONFIGURACIÓN =====
  readonly config = RESERVATION_CONFIG;
  readonly AVAILABLE_SLOTS = signal(this.config.AVAILABLE_SLOTS);

  // ===== ESTADO REACTIVO (SIGNALS) =====
  currentDate = signal(new Date());
  selectedDate = signal<Date | null>(null);
  selectedSlot = signal<string | null>(null);
  currentStep = signal<1 | 2 | 3>(1);
  isLoading = signal(false);
  
  // Form Fields
  customerName = signal('');
  customerPhone = signal('');
  deviceModel = signal('');
  issueDescription = signal('');
  agreeTerms = signal(false);

  // ===== COMPUTED VALUES =====
  currentMonthYear = computed(() => {
    const date = this.currentDate();
    return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
      .format(date)
      .charAt(0)
      .toUpperCase() + 
      new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
        .format(date)
        .slice(1);
  });

  daysInMonth = computed(() => this.generateDaysInMonth(this.currentDate()));

  formattedSelectedDate = computed(() => {
    const date = this.selectedDate();
    if (!date) return '';
    return new Intl.DateTimeFormat('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }).format(date);
  });

  isFormComplete = computed(() => 
    !!this.selectedDate() && 
    !!this.selectedSlot() && 
    this.customerName().trim().length > 0 && 
    this.customerPhone().trim().length > 0 &&
    this.deviceModel().trim().length > 0 &&
    this.issueDescription().trim().length > 0 &&
    this.agreeTerms()
  );

  // ===== PASOS =====
  steps = computed<ReservationStep[]>(() => [
    { number: 1, title: 'Elige tu día', completed: !!this.selectedDate() },
    { number: 2, title: 'Elige tu hora', completed: !!this.selectedSlot() },
    { number: 3, title: 'Confirma datos', completed: this.isFormComplete() }
  ]);

  ngOnInit(): void {
    this.initializeCalendar();
  }

  private initializeCalendar(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.currentDate.set(today);
  }

  // ===== MÉTODOS DE NAVEGACIÓN =====
  prevMonth(): void {
    const date = new Date(this.currentDate());
    date.setMonth(date.getMonth() - 1);
    this.currentDate.set(date);
    this.resetSelection();
  }

  nextMonth(): void {
    const date = new Date(this.currentDate());
    date.setMonth(date.getMonth() + 1);
    this.currentDate.set(date);
    this.resetSelection();
  }

  // ===== MÉTODOS DE SELECCIÓN =====
  selectDate(date: Date): void {
    if (this.isPastDate(date)) return;
    this.selectedDate.set(date);
    this.selectedSlot.set(null);
    this.currentStep.set(2);
  }

  selectSlot(slot: string): void {
    this.selectedSlot.set(slot);
    this.currentStep.set(3);
  }

  resetSelection(): void {
    this.selectedDate.set(null);
    this.selectedSlot.set(null);
    this.currentStep.set(1);
    this.customerName.set('');
    this.customerPhone.set('');
    this.deviceModel.set('');
    this.issueDescription.set('');
    this.agreeTerms.set(false);
  }

  // ===== MÉTODOS DE AYUDA =====
  private generateDaysInMonth(date: Date): (Date | null)[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }

  isSelectedDate(date: Date | null): boolean {
    if (!date || !this.selectedDate()) return false;
    const selected = this.selectedDate()!;
    return date.getDate() === selected.getDate() && 
           date.getMonth() === selected.getMonth() && 
           date.getFullYear() === selected.getFullYear();
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  isFutureDate(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }

  getWeekDayName(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date);
  }

  // ===== ACCIÓN PRINCIPAL =====
  async confirmReservation(): Promise<void> {
    if (!this.isFormComplete()) return;

    this.isLoading.set(true);

    try {
      const reservation = {
        date: this.selectedDate()!.toISOString().split('T')[0],
        slot: this.selectedSlot(),
        name: this.customerName(),
        phone: this.customerPhone(),
        deviceModel: this.deviceModel(),
        issueDescription: this.issueDescription(),
        discount: this.config.DISCOUNT_PERCENTAGE
      };

      // Guardar reserva y enviar notificacion en BD
      const { error } = await this.contactService.createReservation(reservation);
      
      if (error) {
        console.error('Error returned from contactService:', error);
        throw new Error(error.message || 'Error al guardar reserva');
      }

      // Simular éxito (1.5s delay para UX)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Construir mensaje de WhatsApp
      const message = this._buildWhatsAppMessage(reservation);
      
      // Abrir WhatsApp (SSR-safe check usando DOCUMENT)
      if (this.document.defaultView) {
        this.document.defaultView.open(`https://wa.me/${this.config.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      }

      // Notificación de éxito
      this.notificationService.showSuccess('✅ ¡Turno reservado! Se abrirá WhatsApp para confirmar.');
      
      // Reset después de confirmación exitosa
      setTimeout(() => {
        this.resetSelection();
      }, 2000);

    } catch (error) {
      console.error('Error en reserva:', error);
      this.notificationService.showError('❌ Hubo un error al reservar. Intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private _buildWhatsAppMessage(reservation: any): string {
    return `¡Hola Arecofix! 🔧\n\n*Solicito agendar mi turno:*\n\n📅 *Fecha:* ${this.formattedSelectedDate()}\n⏰ *Hora:* ${reservation.slot}\n👤 *Nombre:* ${reservation.name}\n📱 *Teléfono:* ${reservation.phone}\n📱 *Equipo:* ${reservation.deviceModel}\n⚠️ *Falla:* ${reservation.issueDescription}\n\n✅ Confirmo el ${this.config.DISCOUNT_PERCENTAGE}% de descuento en mano de obra.\n🔒 Mi repuesto será reservado en el taller.\n\n¡Gracias!`;
  }
}