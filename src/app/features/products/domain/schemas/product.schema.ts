import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre del producto es obligatorio')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  description: z.string().max(2000, 'La descripción no puede exceder 2000 caracteres').optional().nullable(),
  price: z
    .number()
    .positive('El precio debe ser mayor a 0')
    .max(99999999, 'El precio no puede exceder 99,999,999'),
  cost: z
    .number()
    .nonnegative('El costo de compra no puede ser negativo')
    .optional()
    .nullable(),
  stock: z
    .number()
    .int('El stock debe ser un número entero')
    .nonnegative('El stock no puede ser negativo'),
  minStock: z
    .number()
    .int('El stock mínimo debe ser un número entero')
    .nonnegative('El stock mínimo no puede ser negativo')
    .default(0),
  sku: z
    .string()
    .regex(/^[A-Za-z0-9_-]*$/, 'El SKU solo puede contener caracteres alfanuméricos, guiones y guiones bajos')
    .optional()
    .nullable()
    .or(z.literal('')),
  categoryId: z.string().optional().nullable().or(z.literal('')),
  supplierId: z.string().optional().nullable().or(z.literal('')),
  imageUrl: z.string().optional().nullable().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

export function validateProductData(data: unknown): {
  success: boolean;
  data?: ProductInput;
  errors?: Record<string, string>;
  firstError?: string;
} {
  const result = productSchema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.') || 'root';
      errors[path] = issue.message;
    }
    const firstError = result.error.issues[0]?.message || 'Error de validación';
    return { success: false, errors, firstError };
  }
  return { success: true, data: result.data };
}
