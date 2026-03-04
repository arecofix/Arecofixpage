import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zona-norte-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zona-norte-galeria.component.html',
  styleUrls: ['./zona-norte-galeria.component.scss']
})
export class ZonaNorteGaleriaComponent {
  
  categorias = [
    { id: 'todos', nombre: 'Todos los Trabajos' },
    { id: 'baneras', nombre: 'Bañeras y Jacuzzis' },
    { id: 'sanitarios', nombre: 'Sanitarios' },
    { id: 'azulejos', nombre: 'Azulejos' },
    { id: 'parquet', nombre: 'Parquet' }
  ];

  categoriaActual = 'todos';

  // Método para obtener nombre de categoría de forma segura
  getNombreCategoria(categoriaId: string): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria?.nombre || 'Sin categoría';
  }

  proyectos = [
    {
      id: 1,
      titulo: 'Hotel 5 Estrellas - Palermo',
      descripcion: 'Restauración completa de 20 bañeras de lujo con acabado brillante',
      categoria: 'baneras',
      imagen: 'assets/img/branches/zona-norte/proyecto-1.jpg',
      antes: 'assets/img/branches/zona-norte/proyecto-1-antes.jpg',
      despues: 'assets/img/branches/zona-norte/proyecto-1-despues.jpg',
      cliente: 'Hotel Boutique Palermo',
      duracion: '5 días',
      tecnologias: ['Resina alemana', 'Acabado brillante', 'Garantía 3 años']
    },
    {
      id: 2,
      titulo: 'Consorcio - Belgrano',
      descripcion: 'Enlozado de sanitarios en 10 unidades del consorcio',
      categoria: 'sanitarios',
      imagen: 'assets/img/branches/zona-norte/proyecto-2.jpg',
      antes: 'assets/img/branches/zona-norte/proyecto-2-antes.jpg',
      despues: 'assets/img/branches/zona-norte/proyecto-2-despues.jpg',
      cliente: 'Consorcio Belgrano 1500',
      duracion: '3 días',
      tecnologias: ['Cambio de color', 'Reparación de fisuras', 'Mismo día']
    },
    {
      id: 3,
      titulo: 'Residencia Privada - Barrio Norte',
      descripcion: 'Pulido completo de parquet en toda la vivienda',
      categoria: 'parquet',
      imagen: 'assets/img/branches/zona-norte/proyecto-3.jpg',
      antes: 'assets/img/branches/zona-norte/proyecto-3-antes.jpg',
      despues: 'assets/img/branches/zona-norte/proyecto-3-despues.jpg',
      cliente: 'Residencia Privada',
      duracion: '2 días',
      tecnologias: ['3 procesos lijado', '3 manos laca', 'Alto tránsito']
    },
    {
      id: 4,
      titulo: 'Hospital - CABA',
      descripcion: 'Restauración de baños institucionales con materiales especiales',
      categoria: 'azulejos',
      imagen: 'assets/img/branches/zona-norte/proyecto-4.jpg',
      antes: 'assets/img/branches/zona-norte/proyecto-4-antes.jpg',
      despues: 'assets/img/branches/zona-norte/proyecto-4-despues.jpg',
      cliente: 'Hospital Municipal',
      duracion: '4 días',
      tecnologias: ['Azulejos antibacteriales', 'Pastina especial', 'Normas hospitalarias']
    },
    {
      id: 5,
      titulo: 'Spa - Puerto Madero',
      descripcion: 'Restauración de jacuzzi y área húmeda completa',
      categoria: 'baneras',
      imagen: 'assets/img/branches/zona-norte/proyecto-5.jpg',
      antes: 'assets/img/branches/zona-norte/proyecto-5-antes.jpg',
      despues: 'assets/img/branches/zona-norte/proyecto-5-despues.jpg',
      cliente: 'Spa Exclusive',
      duracion: '3 días',
      tecnologias: ['Resina premium', 'Antihongos', 'Alta durabilidad']
    },
    {
      id: 6,
      titulo: 'Oficina Corporativa - Microcentro',
      descripcion: 'Instalación de azulejos en baños de oficina',
      categoria: 'azulejos',
      imagen: 'assets/img/branches/zona-norte/proyecto-6.jpg',
      antes: 'assets/img/branches/zona-norte/proyecto-6-antes.jpg',
      despues: 'assets/img/branches/zona-norte/proyecto-6-despues.jpg',
      cliente: 'Corporate Building',
      duracion: '2 días',
      tecnologias: ['Azulejos premium', 'Instalación rápida', 'Mínimo impacto']
    }
  ];

  proyectoSeleccionado: any = null;

  constructor() { }

  filtrarPorCategoria(categoria: string) {
    this.categoriaActual = categoria;
  }

  get proyectosFiltrados() {
    if (this.categoriaActual === 'todos') {
      return this.proyectos;
    }
    return this.proyectos.filter(p => p.categoria === this.categoriaActual);
  }

  verProyecto(proyecto: any) {
    this.proyectoSeleccionado = proyecto;
  }

  cerrarProyecto() {
    this.proyectoSeleccionado = null;
  }

  contactarWhatsApp(proyecto?: any) {
    const mensaje = proyecto 
      ? `Hola, quiero consultar sobre el proyecto "${proyecto.titulo}" de Sudamericana Enlozados`
      : 'Hola, quiero consultar sobre los trabajos de Sudamericana Enlozados';
    window.open(`https://wa.me/5491563049494?text=${encodeURIComponent(mensaje)}`, '_blank');
  }

  llamarTelefono() {
    window.open('tel:0111563049494', '_self');
  }
}
