import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
}

@Component({
  selector: 'app-repuestos',
  imports: [],
  templateUrl: './repuestos.html',
  styleUrl: './repuestos.css'
})
export class Repuestos {
  whatsappNumber = '5491112345678'; // Reemplaza con tu número
  selectedProduct: Product | null = null;
  
  featuredProducts: Product[] = [
    {
      id: 'pant-iph11',
      name: 'Pantalla iPhone 11 Original',
      price: '$12,999',
      category: 'Pantallas',
      image: 'https://images.unsplash.com/photo-1636479964609-8fa6e0b3a24e',
      description: 'Pantalla original de reemplazo con garantía'
    },
    {
      id: 'bat-s21',
      name: 'Batería Samsung S21 Ultra',
      price: '$8,499',
      category: 'Baterías',
      image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb',
      description: 'Batería de alta capacidad 5000mAh'
    },
    {
      id: 'cam-iph13',
      name: 'Módulo Cámara iPhone 13',
      price: '$15,299',
      category: 'Cámaras',
      image: 'https://images.unsplash.com/photo-1630418885998-6ac5a5a2d1a0',
      description: 'Módulo completo de cámara trasera original'
    }
  ];

  constructor(private router: Router) {}

  selectProduct(product: Product): void {
    this.selectedProduct = product;
  }

  getWhatsappLink(): string {
    if (!this.selectedProduct) return '#';
    
    const message = `Hola, estoy interesado en: ${this.selectedProduct.name} (${this.selectedProduct.price}) - Código: ${this.selectedProduct.id}`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}