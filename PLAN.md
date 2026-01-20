# Plan de Transformación: Arecofix Consultant (AI & Software)

## Objetivos

1.  **Repositioning**: Transformar de "Servicio Técnico" a "Consultora IT & Desarrollo AI" con alcance global (LatAm, USA, Europa).
2.  **UX/UI Premium**: Implementar diseño "Glassmorphism" con colores vibrantes, modo oscuro elegante y animaciones fluidas.
3.  **Correcciones Técnicas**: Solucionar problemas de superposición en el botón de WhatsApp y "logos fantasma".
4.  **SEO Global**: Optimizar para keywords de alto valor en múltiples regiones.

## Roadmap de Implementación

### Fase 1: Correcciones Críticas (Cleanup)

- **Botón WhatsApp**: Aumentar `z-index` a `99999` y asegurar que no haya otros elementos flotantes o logos con `position: fixed` en la misma área.
- **Review de Logos**: Inspeccionar la sección "Trusted Partners" y "Tech Stack" para asegurar que no tengan estilos que rompan el layout en móviles o se superpongan indebidamente.
- **Limpieza**: Remover cualquier código muerto o assets no utilizados.

### Fase 2: Rediseño Visual (The "WOW" Factor)

- **Fuentes**: Incorporar `Exo 2` (Headers, Tech feel) y `Inter` (Body, Clean readability).
- **Glassmorphism**: Crear sistema de clases `.glass-card`, `.glass-panel` en `styles.css`.
- **Colores**:
  - Primary: `var(--color-brand-dark-blue)` (Base)
  - Accent 1: `var(--color-brand-green)` (Neon Green for AI/Success)
  - Accent 2: `var(--color-brand-blue)` (Electric Blue for Tech)
  - Gradients: Uso de gradientes sutiles en fondos y textos.
- **Animaciones**: Integrar `animate-on-scroll` (fade-in, slide-up) para dar vida a la interacción.

### Fase 3: Estrategia de Contenido (AI & Software First)

- **Hero Section**: Cambiar copy a "Impulsando el Futuro con Inteligencia Artificial y Software a Medida".
- **Servicios (Update `servicios.data.ts`)**:
  - Agregar: "Desarrollo de Agentes AI", "Integración de LLMs (GPT/Claude)", "Automatización de Procesos", "Computer Vision".
  - Mantener (pero secundario): Reparación de Hardware (como "Soporte de Infraestructura").
- **Tech Stack**: Agregar iconos de Python, TensorFlow, PyTorch, Angular, Node.js, Spring Boot, OpenAI.
- **Cobertura Global**: Mencionar explícitamente "Servicios para Argentina, México, Colombia, España y USA".

### Fase 4: SEO Optimización

- **Meta Tags**: Títulos y descripciones dinámicas enfocadas en "Consultoría IT" y "AI Development".
- **Structured Data**: Implementar JSON-LD para `ProfessionalService` con áreas de servicio globales.
- **Sitemap**: Actualizar estructura de rutas.

### Fase 5: Clean Code & Architecture

- **Refactorización**: Asegurar que `PublicHomePage` consuma datos estrictamente de `content$` y no tenga textos hardcodeados.
- **Componentización**: Extraer secciones repetitivas (ej. "Service Card") a componentes reutilizables si es necesario.

---

**Nota sobre "Recursividad"**: Iteraremos sobre el diseño. Primero estructura, luego estilo, luego pulido de animaciones.
