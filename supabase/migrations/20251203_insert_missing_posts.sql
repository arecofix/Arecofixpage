-- Insert missing posts to prevent 406 errors

INSERT INTO posts (slug, title, content, published, image, meta_title, meta_description)
VALUES 
(
  'servicio-tcnico-iphone',
  'Servicio Técnico iPhone | Arecofix',
  '<div class="prose max-w-none"><p>Servicio técnico especializado en iPhone.</p></div>',
  true,
  'https://images.unsplash.com/photo-1591196702597-062a0e327edb?q=80&w=2070&auto=format&fit=crop',
  'Servicio Técnico iPhone',
  'Reparación de iPhone en Marcos Paz.'
),
(
  'iphone-store-marcos-paz',
  'iPhone Store Marcos Paz | Arecofix',
  '<div class="prose max-w-none"><p>Venta de equipos iPhone en Marcos Paz.</p></div>',
  true,
  'https://images.unsplash.com/photo-1591196702597-062a0e327edb?q=80&w=2070&auto=format&fit=crop',
  'iPhone Store Marcos Paz',
  'Tu tienda de iPhone en Marcos Paz.'
)
ON CONFLICT (slug) DO NOTHING;
