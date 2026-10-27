# Guía de Uso del Editor de Bloques y Creador de Landings

**Para:** Administradores y creadores de contenido de Arecofix  
**Ubicación:** Panel de Administración -> Catálogo de Servicios (`/admin/services`)  

---

## Cómo Crear y Publicar una Landing de Servicio en 5 Pasos

### Paso 1: Crear el Nuevo Servicio
1. Ingresá al panel de administración en `/admin/services`.
2. Hacé clic en el botón **"+ Nuevo Servicio"**.
3. En la pestaña **Contenido**, ingresá el **Nombre del Servicio** (por ejemplo: *Recuperación de Datos de Discos y Memorias*).
4. El sistema autogenerará un **Slug** amigable para la URL (por ejemplo: `recuperacion-de-datos-de-discos-y-memorias`). Podés editarlo si deseás una URL más corta.
5. Completá una **Descripción Corta** de 1 o 2 oraciones (máximo 280 caracteres).
6. Hacé clic en **"Guardar"** para generar el borrador en la base de datos.

---

### Paso 2: Personalizar los Bloques Visuales
1. Cambiá a la pestaña **"Bloques de la Landing"**.
2. Verás la lista de bloques en la columna izquierda y una **Vista Previa en Vivo** en la columna derecha.
3. Para cambiar el orden de las secciones en la página, **arrastrá y soltá** cualquier bloque desde el ícono de agarradera vertical (`⠿`).
4. Para añadir nuevas secciones, hacé clic en **"+ Agregar Bloque"** y elegí entre los 10 tipos disponibles:
   - **Hero (Encabezado):** Título principal, llamado a la acción y foto destacada.
   - **Características:** Beneficios con íconos para destacar rapidez, garantía y calidad.
   - **Texto Enriquecido (Markdown):** Explicación detallada de cómo se realiza el trabajo.
   - **Galería de Fotos:** Imágenes de antes/después o equipos del laboratorio.
   - **Llamada a la Acción (CTA):** Botón directo a WhatsApp con mensaje automático.
   - **Preguntas Frecuentes (FAQ):** Respuestas a dudas habituales sobre presupuestos y demoras.
   - **Testimonios:** Opiniones de clientes satisfechos con estrellas de calificación.
   - **Formulario de Contacto:** Captura de nombre, teléfono y consulta directa.
   - **Mapa y Dirección:** Ubicación en Google Maps de Jorge Newbery 69, Marcos Paz.
   - **Lista de Servicios:** Muestra otros servicios para que el cliente siga navegando.

---

### Paso 3: Optimizar para Google (SEO)
1. Cambiá a la pestaña **"SEO & Buscadores"**.
2. El sistema sugiere automáticamente un título y descripción basados en el contenido, pero podés personalizarlos:
   - **Meta Título:** Máximo 70 caracteres. Procurá incluir la localidad (*Marcos Paz*).
   - **Meta Descripción:** Máximo 160 caracteres. Resumí el beneficio principal.
3. Observá la tarjeta de **Previsualización en Google (SERP)** para verificar exactamente cómo verán tu página los usuarios en los resultados de búsqueda.

---

### Paso 4: Ajustar Precio y Operativa
1. Cambiá a la pestaña **"Configuración Operativa"**.
2. **Precio Base:** Ingresá el monto orientativo (en Pesos Argentinos). Si el trabajo requiere evaluación previa de laboratorio, **dejá el campo vacío** y en la web se mostrará el botón profesional **"Consultar"**.
3. **Duración Estimada:** Minutos habituales que toma el procedimiento.
4. **Permite Cotización Online:** Marcá la casilla para habilitar el formulario de consulta.

---

### Paso 5: Publicar y Verificar
1. En la barra superior, hacé clic en el botón verde **"Publicar"**.
2. El sistema verificará que la página tenga al menos una descripción corta y un bloque de encabezado.
3. La página pasará inmediatamente al estado **"Publicado"** y aparecerá el botón **"Ver en web"**.
4. Hacé clic en **"Ver en web"** para abrir la landing page en una pestaña nueva (`https://arecofix.com.ar/servicios/:slug`) y comprobar el resultado final.

---

## Gestión de Prospectos (Leads)
- Cada vez que un visitante completa el formulario en una landing, el lead se guarda en la base de datos y podés gestionarlo desde:
  - La pestaña **"Leads & Consultas"** dentro de la edición del servicio.
  - La sección general `/admin/leads`, donde podés cambiar su estado comercial (*Nuevo*, *Contactado*, *Cotizado*, *Ganado*, *Perdido*) y abrir WhatsApp directamente con un solo clic.
