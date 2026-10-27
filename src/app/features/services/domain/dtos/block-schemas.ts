import { z } from 'zod';

export const HeroBlockSchema = z.object({
  title: z.string().min(1, 'El título del Hero es obligatorio').max(120, 'Máximo 120 caracteres'),
  subtitle: z.string().max(280, 'Máximo 280 caracteres').optional().default(''),
  imageUrl: z.string().optional().default(''),
  ctaLabel: z.string().max(40, 'Máximo 40 caracteres').optional().default(''),
  ctaHref: z.string().max(500).optional().default(''),
  align: z.enum(['left', 'center', 'right']).default('left'),
});

export const FeaturesBlockSchema = z.object({
  title: z.string().max(120).optional().default(''),
  subtitle: z.string().max(280).optional().default(''),
  items: z.array(
    z.object({
      title: z.string().min(1, 'Título del item requerido').max(100),
      description: z.string().max(300).optional().default(''),
      icon: z.string().max(80).optional().default('fa-check-circle'),
    })
  ).default([]),
});

export const RichTextBlockSchema = z.object({
  content: z.string().min(1, 'El contenido no puede estar vacío'),
});

export const GalleryBlockSchema = z.object({
  title: z.string().max(120).optional().default(''),
  images: z.array(
    z.object({
      url: z.string().min(1, 'URL requerida'),
      caption: z.string().max(160).optional().default(''),
      alt: z.string().max(120).optional().default('Imagen descriptiva'),
    })
  ).default([]),
});

export const CtaBlockSchema = z.object({
  title: z.string().min(1, 'Título requerido').max(120),
  subtitle: z.string().max(280).optional().default(''),
  buttonLabel: z.string().min(1, 'Texto del botón requerido').max(50),
  buttonHref: z.string().max(500).optional().default(''),
  style: z.enum(['primary', 'secondary', 'whatsapp']).default('primary'),
  whatsappMessage: z.string().max(200).optional().default(''),
});

export const FaqBlockSchema = z.object({
  title: z.string().max(120).optional().default('Preguntas Frecuentes'),
  items: z.array(
    z.object({
      question: z.string().min(1, 'La pregunta es obligatoria').max(200),
      answer: z.string().min(1, 'La respuesta es obligatoria').max(1000),
    })
  ).default([]),
});

export const TestimonialsBlockSchema = z.object({
  title: z.string().max(120).optional().default('Lo que dicen nuestros clientes'),
  items: z.array(
    z.object({
      author: z.string().min(1).max(80),
      role: z.string().max(80).optional().default('Cliente'),
      text: z.string().min(1).max(500),
      rating: z.number().int().min(1).max(5).default(5),
      avatarUrl: z.string().optional().default(''),
    })
  ).default([]),
});

export const ContactBlockSchema = z.object({
  title: z.string().max(120).optional().default('Contactanos'),
  subtitle: z.string().max(280).optional().default('Dejanos tu consulta y te responderemos a la brevedad.'),
  showPhone: z.boolean().default(true),
  showEmail: z.boolean().default(true),
  messagePlaceholder: z.string().max(150).optional().default('Describí tu requerimiento...'),
});

export const MapBlockSchema = z.object({
  title: z.string().max(120).optional().default('Ubicación'),
  address: z.string().max(200).default('Jorge Newbery 69, Marcos Paz, Buenos Aires'),
  embedUrl: z.string().optional().default('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.4716766447844!2d-58.8205479234856!3d-34.76767577289808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc92c6e61a49c9%3A0x673418525e9e0f07!2sJorge%20Newbery%2069%2C%20Marcos%20Paz%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1714000000000!5m2!1ses-419!2sar'),
  zoom: z.number().int().min(1).max(20).default(16),
});

export const ServiceListBlockSchema = z.object({
  title: z.string().max(120).optional().default('Otros Servicios Relacionados'),
  maxItems: z.number().int().min(1).max(12).default(4),
});

export const BlockTypeEnum = z.enum([
  'hero',
  'features',
  'rich_text',
  'gallery',
  'cta',
  'faq',
  'testimonials',
  'contact',
  'map',
  'service_list',
]);

export type BlockType = z.infer<typeof BlockTypeEnum>;

export const BlockSchemasByType: Record<BlockType, z.ZodTypeAny> = {
  hero: HeroBlockSchema,
  features: FeaturesBlockSchema,
  rich_text: RichTextBlockSchema,
  gallery: GalleryBlockSchema,
  cta: CtaBlockSchema,
  faq: FaqBlockSchema,
  testimonials: TestimonialsBlockSchema,
  contact: ContactBlockSchema,
  map: MapBlockSchema,
  service_list: ServiceListBlockSchema,
};

export function validateBlockContent(type: BlockType, content: unknown): { success: boolean; data?: any; error?: string } {
  const schema = BlockSchemasByType[type];
  if (!schema) {
    return { success: false, error: `Tipo de bloque desconocido: ${type}` };
  }
  const result = schema.safeParse(content);
  if (!result.success) {
    const issues: any[] = result.error?.issues || (result.error as any)?.errors || [];
    const errorMsg = issues.length > 0
      ? issues.map((e: any) => `${e.path?.join('.') || 'campo'}: ${e.message}`).join(', ')
      : result.error?.message || 'Error de validación';
    return { success: false, error: errorMsg };
  }
  return { success: true, data: result.data };
}
