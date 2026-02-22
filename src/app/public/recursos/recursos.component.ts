import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recursos',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div class="container mx-auto px-4">
        
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Centro de Recursos</h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Herramientas, guías y utilidades para técnicos y clientes de Arecofix.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          <!-- Card 1: FixTécnicos (Drivers/Soft) -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700">
            <div class="h-48 bg-indigo-600 flex items-center justify-center">
              <i class="fas fa-microchip text-6xl text-white opacity-80"></i>
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">FixTécnicos</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Accede a nuestra base de datos de drivers, esquemáticos y software de servicio técnico. Exclusivo para gremio.
              </p>
              <a routerLink="/gsm" class="block w-full py-3 px-6 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
                Ir a Descargas
              </a>
            </div>
          </div>

          <!-- Card 2: Blog / Novedades -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700">
            <div class="h-48 bg-purple-600 flex items-center justify-center">
              <i class="fas fa-newspaper text-6xl text-white opacity-80"></i>
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Blog y Novedades</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Tutoriales de reparación, noticias del mundo GSM y guías paso a paso para solucionar problemas comunes.
              </p>
              <a routerLink="/blog" class="block w-full py-3 px-6 text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                Leer Blog
              </a>
            </div>
          </div>

          <!-- Card 3: Seguimiento -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700">
            <div class="h-48 bg-green-600 flex items-center justify-center">
              <i class="fas fa-search text-6xl text-white opacity-80"></i>
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Estado de Reparación</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Consulta el estado de tu equipo en tiempo real ingresando tu código de orden de servicio.
              </p>
              <!-- Link to a tracking page/search form. Assuming /tracking exists but needs code. Linking to home#tracking or similar if no direct page -->
              <a routerLink="/tracking/buscar" class="block w-full py-3 px-6 text-center bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
                Consultar Estado
              </a>
            </div>
          </div>

        </div>

        <div class="mt-16 text-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">¿Buscas Cursos de Reparación?</h2>
            <p class="text-gray-600 dark:text-gray-300 mb-8">
                Capacítate con los mejores en Arecofix Academy.
            </p>
            <a routerLink="/academy" class="inline-flex items-center px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full hover:opacity-90 transition-opacity">
                <i class="fas fa-graduation-cap mr-2"></i> Ver Cursos
            </a>
        </div>

      </div>
    </div>
  `
})
export class RecursosComponent {}
