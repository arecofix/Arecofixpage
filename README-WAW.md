# 🌐 Integración de Widget de Accesibilidad WAW en Arecofix

Este documento detalla la arquitectura, instalación, aislamiento y uso del widget de accesibilidad **WAW (Web Accessibility Widget)** (`https://github.com/erme07/waw.git`) integrado de forma completa y limpia en **Arecofix** (Angular 21 + SSR + TailwindCSS 4 + DaisyUI 5).

---

## 1. Método de Instalación Elegido

- **Paquete:** `waw-widget@1.0.5`
- **Gestor:** `pnpm add waw-widget`
- **Justificación NPM vs CDN:**
  - Se eligió la instalación vía **NPM** para garantizar reproducibilidad en CI/CD, auditoría de dependencias (`pnpm-lock.yaml`), empaquetado optimizado mediante *dynamic import* (lazy loading) y cero dependencias de CDNs externas que puedan ser bloqueadas por Content Security Policy (CSP) o bloqueadores de anuncios.
- **Activos estáticos (`public/assets/`):**
  - Los archivos de fuentes (`Lexend-*.woff`, `OpenDyslexicAlta-*.woff`) e iconos/cursores (`icons.svg`, `options.svg`, `cursor.cur`, `pointer.cur`) se ubicaron en `public/assets/fonts/` y `public/assets/icons/`.
  - Esto asegura que las peticiones se sirvan con rutas absolutas (`/assets/...`), evitando errores 404 en rutas anidadas (`/admin/...`, `/products/...`).

---

## 2. Estructura de Archivos Creados y Modificados

```
src/
├── types/
│   └── waw-widget.d.ts                     # Declaraciones TypeScript para waw-widget
├── app/
│   ├── core/
│   │   └── services/
│   │       └── waw-accessibility.service.ts # Servicio Angular dedicado (lazy import, SSR guard, API)
│   ├── shared/
│   │   └── components/
│   │       ├── accessibility-sidebar/      # Panel de accesibilidad nativo unificado
│   │       │   ├── accessibility-sidebar.component.ts # Conexión con WawAccessibilityService
│   │       │   └── accessibility-sidebar.html         # Sección de Herramientas Avanzadas y accesos directos
│   │       └── waw-widget/
│   │           ├── waw-widget.component.ts # Componente contenedor raíz (ViewEncapsulation.None)
│   │           └── waw-widget.css          # Estilos de WAW completamente aislados y encapsulados
│   ├── app.ts                              # Registro de WawWidgetComponent en imports
│   └── app.html                            # Inclusión única de <app-waw-widget>
public/
└── assets/
    ├── fonts/                              # Tipografías Lexend y OpenDyslexic
    └── icons/                              # Sprites SVG y cursores de alta visibilidad
angular.json                                # Inclusión de "hammerjs" en allowedCommonJsDependencies
```

---

## 3. Aislamiento Crítico de Estilos (Zero-Leakage)

Durante la auditoría del CSS original de WAW (`style.css`), se detectaron selectores globales agresivos:
- `.grid { ... }`: configuraba un layout de 3 columnas con `grid-template-areas` específicas de WAW.
- `.active { ... }`: aplicaba colores y bordes fucsia a cualquier elemento activo.
- `.progress { ... }`: colisionaba con los componentes de barra de progreso de DaisyUI.
- `input[type="radio"]`: cambiaba el acento de todos los radios del sitio.

### Solución Implementada:
En `src/app/shared/components/waw-widget/waw-widget.css`:
1. **Encapsulación estricta:** Todos los selectores internos se confinaron a `.waw .grid`, `.waw .opcion.active`, `.waw .progress`, `.waw input[type="radio"]`. De esta manera, **TailwindCSS `.grid` y DaisyUI `.active` / `.progress` quedan 100% protegidos**.
2. **Unificación visual (Sin botones duplicados):** Se ocultó el botón flotante redundante de WAW (`#open-button { display: none !important; }`). Solo permanece visible el botón flotante y el acceso en el footer de Arecofix.
3. **Rutas absolutas:** Las fuentes `@font-face` y cursores apuntan a `/assets/fonts/...` y `/assets/icons/...`.
4. **Z-Index:** Se asignó `z-index: 2100` a `.waw` y `2050` a la línea y máscara de lectura para que no queden ocultas detrás del layout ni interfieran de forma anómala.

---

## 4. Uso desde Código (Desarrollador)

Inyecta `WawAccessibilityService` en cualquier componente o servicio:

```typescript
import { inject } from '@angular/core';
import { WawAccessibilityService } from '@app/core/services/waw-accessibility.service';

export class MiComponente {
  private wawService = inject(WawAccessibilityService);

  // Abrir / Cerrar / Alternar panel completo WAW
  abrirPanel() {
    this.wawService.open();
  }

  cerrarPanel() {
    this.wawService.close();
  }

  alternarPanel() {
    this.wawService.toggle();
  }

  // Restablecer todas las configuraciones de WAW
  restablecer() {
    this.wawService.reset();
  }

  // Accesos rápidos individuales
  toggleDislexia() {
    this.wawService.toggleDyslexia();
  }

  toggleGuiaLectura() {
    this.wawService.toggleReadingLine();
  }

  toggleMascaraLectura() {
    this.wawService.toggleReadingMask();
  }

  toggleCursorGrande() {
    this.wawService.toggleBigCursor();
  }

  toggleLectorVoz() {
    this.wawService.toggleScreenReader();
  }

  togglePausarAnimaciones() {
    this.wawService.toggleStopAnimations();
  }
}
```

---

## 5. Gestión de Preferencias y Persistencia

- **Aislamiento en `localStorage`:**
  - Preferencias de Arecofix: `portfolio-language`, `portfolio-background`, `portfolio-font-size`, `portfolio-high-contrast`.
  - Preferencias de WAW: `wawStates` y `wawConfig`.
  - **No hay colisión ni sobreescritura de claves.**
- **Restablecimiento Unificado:** El botón *"Restablecer todas las preferencias"* en la barra de accesibilidad restablece tanto el tema/tamaño nativo como todas las herramientas de WAW simultáneamente.

---

## 6. Accesibilidad (WCAG 2.1 AA)

- **Navegación por Teclado:** Se agregó soporte nativo para la tecla **`Escape`**. Si el panel de WAW está abierto, presionar `Esc` lo cierra y devuelve automáticamente el foco al elemento que disparó la apertura.
- **Soporte SSR:** Todo acceso al DOM (`document`, `window`, `speechSynthesis`, `localStorage`) está protegido mediante `isPlatformBrowser(platformId)`. El renderizado en servidor de Angular Universal no se ve alterado ni arroja errores.

