import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, CreateMessageDto } from '@app/core/services/contact.service';

@Component({
  selector: 'app-zona-norte-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zona-norte-contacto.component.html',
  styleUrls: ['./zona-norte-contacto.component.scss']
})
export class ZonaNorteContactoComponent {
  
  sucursal = {
    nombre: 'Sudamericana Enlozados',
    direccion: 'Beazley 3735 - Pompeya CABA',
    telefono: '(011) 15-6304-9494',
    email: 'enlosud@hotmail.com',
    whatsapp: '5491563049494',
    horarios: {
      'Lunes a Viernes': '08:00 - 18:00',
      'Sábados': '09:00 - 13:00',
      'Domingos': 'Cerrado'
    }
  };

  formulario = {
    nombre: '',
    telefono: '',
    email: '',
    tipoServicio: '',
    mensaje: ''
  };

  tiposServicio = [
    'Enlozado de Bañeras',
    'Restauración de Sanitarios',
    'Instalación de Azulejos',
    'Pulido de Parquet',
    'Otro servicio'
  ];

  private contactService = inject(ContactService);
  enviando = false;

  constructor() { }

  async enviarFormulario() {
    // Validación básica
    if (!this.formulario.nombre || !this.formulario.telefono || !this.formulario.email || !this.formulario.mensaje) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    this.enviando = true;

    try {
        const msg: CreateMessageDto = {
            name: this.formulario.nombre,
            email: this.formulario.email,
            phone: this.formulario.telefono,
            subject: `Consulta Zona Norte: ${this.formulario.tipoServicio || 'General'}`,
            message: this.formulario.mensaje
        };

        const { error } = await this.contactService.createMessage(msg);

        if (error) {
            console.error('Error enviando formulario:', error);
            alert('Hubo un problema al enviar el mensaje. Intenta luego o por WhatsApp.');
        } else {
            alert('¡Consulta enviada con éxito! Nos contactaremos a la brevedad.');
            this.formulario = {
              nombre: '',
              telefono: '',
              email: '',
              tipoServicio: '',
              mensaje: ''
            };
        }
    } catch (e) {
        console.error('Excepción enviando formulario:', e);
        alert('Hubo un error. Por favor comuníquese por WhatsApp.');
    } finally {
        this.enviando = false;
    }
  }

  contactarWhatsApp(mensaje?: string) {
    const texto = mensaje || 'Hola, quiero consultar sobre los servicios de Sudamericana Enlozados';
    window.open(`https://wa.me/${this.sucursal.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank');
  }

  llamarTelefono() {
    window.open(`tel:${this.sucursal.telefono}`, '_self');
  }

  enviarEmail() {
    window.open(`mailto:${this.sucursal.email}`, '_self');
  }

  abrirMaps() {
    const direccion = encodeURIComponent(this.sucursal.direccion);
    window.open(`https://maps.google.com/?q=${direccion}`, '_blank');
  }

  // Validación de email
  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Validación de teléfono (formato argentino)
  validarTelefono(telefono: string): boolean {
    const re = /^(\d{10,11}|\d{2,3}\s\d{4}\s\d{4})$/;
    return re.test(telefono.replace(/[^\d]/g, ''));
  }
}
