# 📤 ShareButtons Component & ShareService

Componente standalone reutilizable y accesible para compartir contenido en redes sociales y aplicaciones de mensajería en **Arecofix** (Angular 21 + TailwindCSS + DaisyUI).

---

## 🚀 Características Principales

- **Multiplataforma**: Integración directa con **WhatsApp**, **Facebook**, **X (Twitter)**, **LinkedIn**, **Telegram**, **Email** y **Copiar Enlace**.
- **Web Share API Nativo**: En dispositivos móviles (iOS / Android) utiliza `navigator.share()` cuando está disponible, brindando la experiencia nativa del sistema operativo. En desktop o navegadores no compatibles, despliega las opciones web o copia al portapapeles.
- **3 Variantes de Visualización**:
  1. `inline`: Botones en fila/grilla, ideales para fichas de producto, artículos de blog o cursos.
  2. `menu`: Botón compacto tipo dropdown/popover, ideal para barras de herramientas o tarjetas de producto con espacio reducido.
  3. `floating`: Botón de acción flotante (FAB) con animación Speed Dial, ideal para la página de inicio o landings.
- **Accesibilidad Total (WCAG 2.1 AA)**:
  - Navegación completa por teclado (`Tab`, `Shift+Tab`, `Enter`, `Space`).
  - Cierre con tecla `Esc` y restauración automática del foco en el botón disparador.
  - Cierre al hacer clic fuera del componente (`click-outside`).
  - Roles semánticos y atributos ARIA (`role="group"`, `role="menu"`, `role="menuitem"`, `aria-expanded`, `aria-label`).
  - Contraste de color certificado AA y anillos de foco visibles (`focus:ring-2`).
  - Aislamiento z-index: Se oculta automáticamente cuando se abre el panel de accesibilidad WAW (`body.waw-panel-open`).
- **SSR Safe**: Compatible con Server-Side Rendering mediante `isPlatformBrowser` y comprobación segura de `navigator`.
- **Feedback Inmediato**: Integración con `ToastService` al copiar al portapapeles y transición animada con icono de checkmark.

---

## 📦 Instalación y Uso

### 1. Importar el componente en un componente standalone

```typescript
import { Component } from '@angular/core';
import { ShareButtonsComponent } from '@app/shared/components/share-buttons/share-buttons.component';

@Component({
  selector: 'app-mi-pagina',
  standalone: true,
  imports: [ShareButtonsComponent],
  templateUrl: './mi-pagina.component.html'
})
export class MiPaginaComponent {}
```

---

## 🎨 Ejemplos por Variante

### 1. Variante `inline` (Detalle de Producto / Blog)

Muestra los botones alineados con o sin etiquetas de texto.

```html
<app-share-buttons 
  variant="inline"
  [title]="producto.name"
  [text]="'Mirá este repuesto en Arecofix: ' + producto.name"
  [url]="currentUrl"
  [showLabels]="false">
</app-share-buttons>
```

### 2. Variante `menu` (Dropdown Popover)

Muestra un botón compacto "Compartir" que abre un menú desplegable accesible.

```html
<app-share-buttons 
  variant="menu"
  title="Curso de Reparación de Celulares"
  [networks]="['whatsapp', 'facebook', 'x', 'copy']"
  (shared)="onShareEvent($event)">
</app-share-buttons>
```

### 3. Variante `floating` (Botón Flotante Speed Dial)

Flota en la esquina inferior de la pantalla sobre el toggle de accesibilidad, abriendo un menú vertical interactivo.

```html
<app-share-buttons 
  variant="floating"
  title="Arecofix - Servicio Técnico y Repuestos Especializados"
  text="Soluciones profesionales en tecnología y microelectrónica.">
</app-share-buttons>
```

---

## ⚙️ Propiedades (`Inputs` y `Outputs`)

| Propiedad | Tipo | Default | Descripción |
| :--- | :--- | :--- | :--- |
| `[title]` | `string` | `''` | Título del contenido a compartir (si se omite, usa `document.title`). |
| `[text]` | `string` | `''` | Descripción o mensaje acompañante. |
| `[url]` | `string` | `''` | URL absoluta (si se omite, usa `window.location.href`). |
| `[networks]` | `ShareNetwork[]` | `['whatsapp', 'facebook', 'x', 'linkedin', 'telegram', 'email', 'copy']` | Lista y orden de redes a mostrar. |
| `[variant]` | `'inline' \| 'menu' \| 'floating'` | `'inline'` | Modo de visualización visual del componente. |
| `[showLabels]`| `boolean` | `false` | Indica si los botones inline muestran texto además del icono. |
| `[customClass]`| `string` | `''` | Clases CSS adicionales para el contenedor principal. |
| `(shared)` | `EventEmitter<ShareEvent>` | — | Emite evento `{ network: string, url: string }` tras compartir. |

---

## 🛠️ Servicio Inyectable (`ShareService`)

Si necesitas disparar acciones de compartir programáticamente desde TypeScript:

```typescript
import { inject } from '@angular/core';
import { ShareService } from '@app/core/services/share.service';

export class MiServicio {
  private shareService = inject(ShareService);

  async compartirNativo(titulo: string, url: string) {
    if (this.shareService.canUseWebShare()) {
      await this.shareService.share({ title: titulo, url: url });
    } else {
      this.shareService.shareToWhatsApp({ title: titulo, url: url });
    }
  }

  copiar(url: string) {
    this.shareService.copyToClipboard(url);
  }
}
```

---

## ➕ Cómo Agregar una Nueva Red Social

Para añadir soporte para una nueva plataforma (por ejemplo, Reddit o Pinterest):

1. **Actualizar el tipo `ShareNetwork`** en `src/app/core/services/share.service.ts`:
   ```typescript
   export type ShareNetwork = 'whatsapp' | 'facebook' | 'x' | 'linkedin' | 'telegram' | 'email' | 'copy' | 'reddit';
   ```

2. **Agregar el método en `ShareService`**:
   ```typescript
   shareToReddit(data: ShareData): void {
     const url = this.resolveUrl(data);
     const title = this.resolveTitle(data);
     const shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
     this.openPopup(shareUrl, 'Compartir en Reddit');
   }
   ```

3. **Registrar la configuración en `ShareButtonsComponent`** (`src/app/shared/components/share-buttons/share-buttons.component.ts`):
   ```typescript
   reddit: {
     id: 'reddit',
     name: 'Reddit',
     ariaLabel: 'Compartir en Reddit',
     iconClass: 'fa-brands fa-reddit-alien',
     colorClass: 'hover:bg-[#FF4500] hover:text-white hover:border-[#FF4500]'
   }
   ```

4. **Vincular en el switch `onShareNetwork`**:
   ```typescript
   case 'reddit':
     this.shareService.shareToReddit(shareData);
     break;
   ```

---

## 🧪 Pruebas Automatizadas

- **Pruebas Unitarias (Jest)**:
  ```bash
  pnpm test src/app/shared/components/share-buttons/
  pnpm test src/app/core/services/share.service.spec.ts
  ```
- **Auditoría E2E y Accesibilidad (Cypress)**:
  ```bash
  pnpm cypress run --spec "cypress/e2e/ui/accessibility-waw-audit.cy.ts"
  ```

