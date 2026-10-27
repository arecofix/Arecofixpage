# Corrección de Módulo de Facturación: Cálculo de IVA en Factura B y Layout Visual

**Fecha:** 12 de Octubre de 2026  
**Normativa Fiscal:** RG ARCA 5614/2024, RG 5616, Ley 27.743 (Régimen de Transparencia Fiscal al Consumidor), RG 1415/03 y RG 3822/94.  
**Estado:** ✅ Implementado, Probado y Verificado.

---

## 1. Resumen Ejecutivo

Esta orden de trabajo corrigió dos problemas críticos en el módulo de facturación:
1. **Error Legal de IVA en Factura B:** El sistema liquidaba Factura B sumando IVA sobre el total como si fuera Factura A, arrojando totales inflados (ej. $139.890 en vez de $108.600) y discriminando alícuotas explícitamente al consumidor final, en infracción a la Ley 27.743 y la RG 5614/2024.
2. **Solapamientos Visuales del Layout:** La letra del comprobante se superponía con el título, el código fiscal tocaba los bordes, los datos del emisor estaban apiñados sin aire, los campos vacíos mostraban guiones (`--`), el tipo de ítem figuraba como `"General"`, y faltaba jerarquía visual y divisorias en la vista detallada y en la impresión.

Ambos problemas fueron resueltos en su totalidad sin alterar la arquitectura de eventos ni agregar dependencias innecesarias, preservando el 100% de los tests existentes y añadiendo 22 tests específicos.

---

## 2. Problema 1: Cálculo Fiscal y Discriminación de IVA (Factura A vs B vs C)

### 2.1 Diagnóstico del Error Previo
- Al emitir una Factura B con precio bruto de $149.000 y un descuento de $40.400, el método anterior consideraba erróneamente que $149.000 era un importe neto, calculaba IVA del 21% ($31.290) y calculaba:  
  `$149.000 + $31.290 - $40.400 = $139.890` (Incorrecto).
- Además, en la pantalla y en el comprobante se mostraba una grilla con *"Neto Gravado al 21%"* e *"IVA Liquidado al 21%"*, lo cual está expresamente prohibido en Factura B para Consumidores Finales.

### 2.2 Lógica Fiscal Corregida

| Tipo | Regla de Precios | Cálculo del Total | Tratamiento del IVA | Leyenda Obligatoria |
|---|---|---|---|---|
| **Factura A** | Precios Netos | $\text{Subtotal Neto} + \text{IVA Total} - \text{Descuento} + \text{Recargo}$ | Discrimina por alícuota (21%, 10.5%, 27%) | Transparencia Fiscal |
| **Factura B** | Precios Finales (IVA Incluido) | $\sum(\text{Precio Unit.} \times \text{Cant.}) - \text{Descuento} + \text{Recargo}$ | No discrimina por ítem. Neto implícito = $\frac{\text{Total}}{1 + \text{Tasa}}$ | *"El IVA se encuentra incluido en el precio"* |
| **Factura C** | Sin IVA (Monotributo) | $\sum(\text{Precio Unit.} \times \text{Cant.}) - \text{Descuento} + \text{Recargo}$ | IVA = 0. No discrimina | Sin leyenda de transparencia fiscal |

### 2.3 Tratamiento de Múltiples Alícuotas en Factura B
Si una Factura B contiene ítems con distintas alícuotas (ej. 21% y 10.5%):
1. Se calcula el factor de descuento/recargo sobre el total bruto: $\text{factor} = \frac{\text{Total Final}}{\text{Subtotal Bruto}}$.
2. Para cada ítem con alícuota $r_i$:  
   $\text{Bruto Ajustado}_i = (\text{Cantidad}_i \times \text{Precio Unitario}_i) \times \text{factor}$  
   $\text{Neto Implícito}_i = \frac{\text{Bruto Ajustado}_i}{1 + r_i}$  
   $\text{IVA Implícito}_i = \text{Bruto Ajustado}_i - \text{Neto Implícito}_i$  
3. Se totaliza el neto implícito y el IVA implícito para el bloque informativo de la RG 5614.

### 2.4 Casos de Prueba Oficiales

```
Caso Factura A:
  Ítem: 1 x $149.000 (neto) al 21% ($31.290)
  Descuento: $40.400
  Total: $149.000 + $31.290 - $40.400 = $139.890 ✅

Caso Factura B:
  Ítem: 1 x $149.000 (precio final con IVA)
  Descuento: $40.400
  Total a Abonar: $149.000 - $40.400 = $108.600 ✅
  Neto Implícito: $108.600 / 1.21 = $89.752,07
  IVA Incluido: $108.600 - $89.752,07 = $18.847,93
  Leyenda: "El IVA se encuentra incluido en el precio"
```

---

## 3. Problema 2: Solapamientos Visuales y Estándares de Layout

### 3.1 Correcciones del Encabezado
- **Recuadro de Letra de Comprobante:** Se encapsuló en un recuadro de dimensiones fijas de $1\,\text{cm} \times 1\,\text{cm}$ (`10mm x 10mm`), con borde de 1px negro, centrado y con `line-height: 1`.
- **Separación del Título:** El título `FACTURA "B"` o `COMPROBANTE INTERNO` se ubica a la derecha del recuadro con un espaciado horizontal explícito de $8\,\text{mm}$ (`gap-[8mm]`), eliminando cualquier superposición.
- **Código de Comprobante:** El distintivo `Cód. 006` posee `padding: 2mm`, con bordes e interlineado independiente sin tocar el marco exterior.
- **Estructura en Dos Columnas:** Emisor a la izquierda y Datos del Comprobante a la derecha en una grilla con separación horizontal mínima de $8\,\text{mm}$ (`gap-[8mm]`).
- **Espaciados Verticales:** Cada línea de datos cuenta con `margin-bottom: 2mm`, y la *"Fecha de Inicio de Actividades"* cuenta con `margin-bottom: 4mm` para no rozar la línea divisoria inferior.

### 3.2 Bloque del Régimen de Transparencia Fiscal (Factura B)
En cumplimiento estricto con la RG 5614/2024, para Factura B se reemplazó la tabla de IVA discriminado por el siguiente bloque limpio:

```text
┌─────────────────────────────────────────────────────────────┐
│  RÉGIMEN DE TRANSPARENCIA FISCAL AL CONSUMIDOR              │
│  (Ley 27.743 / RG 5614)                                     │
│                                                             │
│  El IVA se encuentra incluido en el precio                  │
│                                                             │
│  Importe Neto:      $ 123.140,50                            │
│  IVA Incluido:      $  25.859,50                            │
│  Importe Total:     $ 149.000,00                            │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Normalización de Datos y Tipografía
- **Campos Vacíos:** Se sustituyeron los guiones (`--` o `---`) por el texto `"No informado"` o cadena vacía cuando no hay CUIT/DNI o domicilio.
- **Clasificación de Ítems:** Se sustituyó la etiqueta `"General"` por badges semánticos con color distintivo:
  - `Mano de obra`: Azul/Índigo (`fa-wrench`)
  - `Repuesto`: Ámbar/Naranja (`fa-microchip`)
  - `Servicio`: Celeste/Sky (`fa-hand-holding-gear`)
  - `Producto`: Esmeralda/Verde (`fa-box`)
- **Jerarquía Tipográfica:**
  - Títulos de sección: `font-size: 11pt`, `font-weight: 700`, mayúsculas, `letter-spacing: 0.5px`.
  - Datos: `font-size: 9.5pt`, `line-height: 1.4`.
  - Totales: `font-size: 13pt`, `font-weight: 700`, alineados a la derecha y con cuadro de destaque.
- **Divisores Visuales:** Líneas divisorias horizontales (`border-bottom: 1px solid #ccc`) y `padding: 4mm` por cada sección.
- **CSS de Impresión:** Verificado para A4 (`@page { size: A4; margin: 10mm 12mm; }`), ocultando elementos UI y asegurando fondo blanco nítido sin páginas en blanco.

---

## 4. Archivos Modificados

| Archivo | Tipo de Cambio |
|---|---|
| `src/app/features/sales/domain/usecases/calculate-arca-totals.usecase.ts` | Lógica fiscal corregida para A, B y C |
| `src/app/features/sales/application/invoice.service.ts` | Delegación canónica de `calculateTotals` a `CalculateArcaTotalsUseCase` |
| `src/app/admin/sales/admin-invoice-detail-page.html` | Layout de encabezado, transparencia fiscal, badges de ítems y campos vacíos |
| `src/app/admin/sales/admin-invoice-detail-page.ts` | Clases de diseño, helpers de medios de pago y datos de emisor |
| `src/app/admin/sales/components/invoice-form-modal/invoice-form-modal.component.html` | Separación de bloques fiscales A y B en modal de creación |
| `src/app/features/sales/application/services/invoice-pdf-export.service.ts` | Exportación a PDF alineada con RG 5614 para Factura B |
| `src/app/core/services/company.service.ts` | Tipado de propiedades fiscales en `CompanySettings` |
| `src/app/domain/invoice/use-cases/CalculateArcaTotalsUseCase.ts` | Alias Clean Architecture de dominio |
| `src/app/domain/invoice/constants/ArcaConstants.ts` | Alias Clean Architecture de constantes |
| `src/app/infrastructure/pdf/InvoicePdfExportService.ts` | Alias Clean Architecture de infraestructura |
| `src/app/presentation/invoice/components/InvoiceDetailComponent.ts` | Alias Clean Architecture de presentación |
| `src/app/features/sales/domain/usecases/calculate-arca-totals.usecase.spec.ts` | 17 tests unitarios fiscales y de validación |
| `src/app/admin/sales/admin-invoice-detail-page.spec.ts` | 5 tests unitarios de layout y no-solapamiento |

---

## 5. Pruebas Ejecutadas

### Tests Unitarios (Jest): 28 suites, 142 tests pasados (100%)
- **Cálculo Fiscal:**
  - `Factura A con IVA 21%: total correcto con discriminación` (PASS)
  - `Factura A con IVA 10.5%: total correcto con discriminación` (PASS)
  - `Factura A con IVA 27%: total correcto con discriminación` (PASS)
  - `Factura A con múltiples alícuotas: suma correcta` (PASS)
  - `Caso Oficial Factura A: $149.000 neto + IVA $31.290 - descuento $40.400 = $139.890` (PASS)
  - `Factura B con IVA incluido: NO discrimina, total correcto` (PASS)
  - `Caso Oficial Factura B: $149.000 sin descuento → Neto $123.140,50, IVA $25.859,50` (PASS)
  - `Caso Oficial Factura B con descuento: $149.000 - $40.400 = $108.600` (PASS)
  - `Factura B con múltiples alícuotas: neto implícito por alícuota` (PASS)
  - `Factura C: sin discriminación de IVA, sin leyenda de transparencia` (PASS)
  - `Factura C con descuento: total = precio - descuento, IVA = 0` (PASS)
  - `Factura X: comprobante interno no fiscal sin IVA` (PASS)
  - `Descuento aplicado en Factura A resta tras sumar IVA` (PASS)
  - `Descuento aplicado en Factura B resta directamente del total bruto` (PASS)
- **Validaciones de Emisor (Monotributo):**
  - `Si el emisor es Monotributista y se intenta emitir Factura A → error` (PASS)
  - `Si el emisor es Monotributista y se intenta emitir Factura B → error` (PASS)
  - `Si el emisor es Monotributista y se intenta emitir Factura C → OK` (PASS)
- **Layout y No-Solapamiento:**
  - `El recuadro de la letra no se solapa con "FACTURA 'B'"` (PASS)
  - `El "Cód. 006" no toca los bordes del contenedor y tiene padding adecuado` (PASS)
  - `Los campos vacíos muestran "No informado" y no "--"` (PASS)
  - `El tipo de ítem muestra "Mano de obra" y no "General"` (PASS)
  - `Factura B muestra el bloque de Transparencia Fiscal sin desglose por alícuota` (PASS)
- **Tests de Integración por Eventos:**
  - 25/25 tests de eventos de dominio pasan al 100%.

### Compilación de Producción
- `pnpm run build` ejecutado exitosamente con 0 errores de compilación TypeScript/Angular.
