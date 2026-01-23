# Auditoría de Calidad y Arquitectura del Proyecto Arecofix

## 1. Resumen Ejecutivo

Este documento detalla los hallazgos de la auditoría de código realizada al proyecto Arecofix. El objetivo es identificar deuda técnica, malas prácticas, código en desuso y oportunidades de mejora para alinear el proyecto con los principios de Clean Architecture y Clean Code.

## 2. Archivos en Desuso y Limpieza

Se han identificado archivos que podrían no ser necesarios para el despliegue en producción o que son remanentes de desarrollo/debugging.

**Acción Recomendada:** Revisar y eliminar si no son necesarios.

- Archivos `.sql`: (Si existen, usualmente no deberían estar en el repo de frontend)
- Archivos `.txt`: Logs o notas temporales (e.g., `deploy_log.txt`).
- Archivos `.md`: Documentación obsoleta o duplicada.

## 3. Calidad de Código (Code Smell)

### 3.1. Uso de `any`

Se detectó el uso del tipo `any` en múltiples archivos TypeScript. Esto anula los beneficios del tipado estático y puede ocultar bugs.

**Archivos Afectados (Muestra):**

- `src/app/shared/components/toast/toast.component.ts`
- `src/app/core/services/logger.service.ts`
- `src/app/core/repositories/base.repository.ts`
- `src/app/features/messages/infrastructure/repositories/supabase-message.repository.ts`
- `src/app/admin/products/services/admin-product.service.ts`
- ... y otros listados en la auditoría.

**Acción Recomendada:** Definir interfaces o tipos DTO adecuados para reemplazar `any`.

### 3.2. Hardcoding de URLs y Valores Mágicos

Se encontraron URLs hardcodeadas (`http://` y `https://`) dispersas en el código en lugar de utilizar los archivos de configuración de entorno (`environment.ts`).

**Archivos Afectados (Muestra):**

- `src/app/public/gsm/services/gsm.service.ts`
- `src/app/public/portfolio/portfolio.ts`
- `src/app/public/reservation/reservation-calendar.ts`
- `src/app/core/services/seo.service.ts`
- ... y otros.

**Acción Recomendada:** Centralizar todas las URLs de API y recursos externos en `environment.ts` y `environment.prod.ts`.

### 3.3. Logs en Producción

Aunque no se encontraron muchos `console.log` directos gracias al `LoggerService`, se debe asegurar que cualquier log residual sea eliminado o canalizado a través del servicio de logging que puede ser desactivado en producción.

## 4. Arquitectura y Estructura

### 4.1. Inconsistencia en la Estructura de Features

Se observó una inconsistencia en la estructura interna de los módulos bajo `src/app/features`.

- **`orders`**: Sigue una estructura robusta (`application`, `domain`, `infrastructure`, `presentation`).
- **`products`**: Tiene una estructura diferente (`data`, `domain`).

**Acción Recomendada:** Estandarizar todos los módulos de `features` para seguir el modelo completo de Clean Architecture usado en `orders`.

### 4.2. Separación de Responsabilidades

- El directorio `src/app/core` parece contener lógica que podría moverse a los módulos de `features` correspondientes o mantenerse si es verdaderamente transversal.
- Los directorios `admin` y `public` actúan como capas de presentación grandes. Se debe asegurar que estos componentes deleguen la lógica de negocio a los **Casos de Uso** (Use Cases) definidos en los módulos de `features`, en lugar de llamar directamente a repositorios o tener lógica de negocio embebida.

## 5. Plan de Refactorización Propuesto

1.  **Limpieza Inicial**: Eliminar archivos basura y logs.
2.  **Estandarización de Arquitectura**:
    - Refactorizar `products` y otros módulos para igualar la estructura de `orders`.
    - Asegurar que `admin` y `public` consuman Use Cases.
3.  **Tipado Fuerte**: Reemplazar `any` por interfaces en servicios críticos y repositorios.
4.  **Centralización de Configuración**: Mover URLs hardcodeadas a los archivos de entorno.
5.  **Optimización**: Revisar la carga perezosa (Lazy Loading) de estos módulos refactorizados.

---

**Estado:** Pendiente de probación por el usuario para comenzar la ejecución.
