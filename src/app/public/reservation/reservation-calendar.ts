import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-reservation-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-calendar.html',
  styleUrl: './reservation-calendar.css'
})
export class ReservationCalendar implements OnInit {
  private auth = inject(AuthService);

  // Configuración
  whatsappNumber = '5491125960900'; 
  availableHours = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  weekDayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Estado
  currentDate = new Date();
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  showTimeSelection = false;
  showConfirmation = false;
  
  // Form Data
  customerName = '';
  customerPhone = '';
  saving = false;

  private initializeCalendar(): void {
    this.currentDate = new Date();
    this.selectedDate = null;
    this.selectedTime = null;
    this.showTimeSelection = false;
    this.showConfirmation = false;
    this.customerName = '';
    this.customerPhone = '';
  }

  ngOnInit(): void {
    this.initializeCalendar();
  }

  // Métodos de navegación
  prevMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.resetSelection();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.resetSelection();
  }

  // Métodos de selección
  selectDate(date: Date): void {
    if (this.isPastDate(date)) return;
    
    this.selectedDate = date;
    this.selectedTime = null;
    this.showTimeSelection = true;
    this.showConfirmation = false;
  }

  selectTime(time: string): void {
    this.selectedTime = time;
    this.showConfirmation = true;
  }

  resetSelection(): void {
    this.selectedDate = null;
    this.selectedTime = null;
    this.showTimeSelection = false;
    this.showConfirmation = false;
  }

  // Métodos de ayuda
  get daysInMonth(): (Date | null)[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Días vacíos para alineación
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    // Días del mes
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
    return !!date && !!this.selectedDate && 
           date.getDate() === this.selectedDate.getDate() && 
           date.getMonth() === this.selectedDate.getMonth() && 
           date.getFullYear() === this.selectedDate.getFullYear();
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  async confirmReservation() {
    if (!this.selectedDate || !this.selectedTime || !this.customerName || !this.customerPhone) {
      alert('Por favor completa todos los datos para continuar.');
      return;
    }

    this.saving = true;

    try {
      const supabase = this.auth.getSupabaseClient();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const formattedDate = this.selectedDate.toLocaleDateString('es-ES', options);
      
      // Save to DB
      await supabase.from('contact_messages').insert({
        name: this.customerName,
        phone: this.customerPhone,
        email: 'reserva@web.com', // Placeholder if email not asked
        subject: `Nueva Reserva: ${formattedDate} ${this.selectedTime}`,
        message: `Reserva solicitada para el ${formattedDate} a las ${this.selectedTime}. Teléfono: ${this.customerPhone}`,
        is_read: false
      });

      // Send WhatsApp
      const message = `¡Hola! Soy ${this.customerName}. Quiero confirmar mi reserva para el ${formattedDate} a las ${this.selectedTime} horas.`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`, '_blank');

      // Reset
      this.resetSelection();
      this.customerName = '';
      this.customerPhone = '';
      
    } catch (error) {
      console.error('Error saving reservation:', error);
      // Still open WhatsApp as fallback
      this.sendWhatsAppMessage(); 
    } finally {
      this.saving = false;
    }
  }

  // Deprecated but kept as fallback
  sendWhatsAppMessage(): void {
    if (!this.selectedDate || !this.selectedTime) return;
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = this.selectedDate.toLocaleDateString('es-ES', options);
    const message = `¡Hola! Quiero reservar una cita para el ${formattedDate} a las ${this.selectedTime} horas.`;
    window.open(`https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  }

  get currentMonthYear(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  get formattedSelectedDate(): string {
    if (!this.selectedDate) return '';
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return this.selectedDate.toLocaleDateString('es-ES', options);
  }
}