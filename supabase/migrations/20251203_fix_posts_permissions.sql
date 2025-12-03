-- FIX DATABASE PERMISSIONS AND DATA

-- 1. Ensure table exists (just in case)
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    image TEXT,
    published BOOLEAN DEFAULT FALSE,
    meta_title TEXT,
    meta_description TEXT
);

-- 2. Reset RLS Policies to be fully public for reading
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Drop potentially conflicting policies
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Admins can do everything with posts" ON posts;
DROP POLICY IF EXISTS "Public read access" ON posts;

-- Create a simple, permissive policy for reading
CREATE POLICY "Public read access" ON posts
    FOR SELECT
    USING (true); -- Allow everyone to read all posts

-- 3. Re-insert the content to ensure it's there
INSERT INTO posts (slug, title, content, published, image, meta_title, meta_description)
VALUES (
  'servicio-tcnico-de-celulares-en-marcos-paz',
  'Servicio Técnico de Celulares en Marcos Paz | Arecofix',
  '<div class="prose max-w-none">
    <p class="lead text-xl text-gray-600 mb-8">
      En <strong>Arecofix</strong>, somos tu solución de confianza para la reparación de celulares en <strong>Marcos Paz</strong>. 
      Entendemos lo importante que es tu dispositivo en tu día a día, por eso ofrecemos un servicio rápido, profesional y garantizado.
    </p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Nuestros Servicios de Reparación</h2>
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h3 class="font-bold text-blue-800 mb-2">📱 Cambio de Pantalla</h3>
        <p class="text-gray-700">Reemplazamos pantallas rotas o dañadas con repuestos de alta calidad (Originales y OLED/LCD premium). Tu celular quedará como nuevo.</p>
      </div>
      <div class="bg-green-50 p-6 rounded-xl border border-green-100">
        <h3 class="font-bold text-green-800 mb-2">🔋 Cambio de Batería</h3>
        <p class="text-gray-700">¿Tu batería dura poco? La cambiamos en el acto para que recuperes la autonomía de tu equipo.</p>
      </div>
      <div class="bg-purple-50 p-6 rounded-xl border border-purple-100">
        <h3 class="font-bold text-purple-800 mb-2">🔌 Pin de Carga</h3>
        <p class="text-gray-700">Si tu celular no carga o hace falso contacto, reparamos o cambiamos el puerto de carga con soldadura de precisión.</p>
      </div>
      <div class="bg-orange-50 p-6 rounded-xl border border-orange-100">
        <h3 class="font-bold text-orange-800 mb-2">💻 Software y Desbloqueo</h3>
        <p class="text-gray-700">Solucionamos problemas de sistema, bootloop, cuentas Google (FRP) y liberaciones.</p>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">¿Por qué elegir Arecofix en Marcos Paz?</h2>
    <ul class="space-y-4 mb-8">
      <li class="flex items-start">
        <span class="text-green-500 mr-2">✅</span>
        <span><strong>Reparaciones en el Acto:</strong> Sabemos que no podés estar sin tu celular. La mayoría de nuestros trabajos se realizan en el día.</span>
      </li>
      <li class="flex items-start">
        <span class="text-green-500 mr-2">✅</span>
        <span><strong>Garantía Escrita:</strong> Todos nuestros trabajos cuentan con garantía para tu tranquilidad.</span>
      </li>
      <li class="flex items-start">
        <span class="text-green-500 mr-2">✅</span>
        <span><strong>Presupuesto Sin Cargo:</strong> Te decimos qué tiene tu equipo y cuánto cuesta repararlo sin compromiso.</span>
      </li>
      <li class="flex items-start">
        <span class="text-green-500 mr-2">✅</span>
        <span><strong>Transparencia:</strong> Te explicamos claramente el problema y la solución. Sin sorpresas.</span>
      </li>
    </ul>

    <div class="bg-gray-900 text-white p-8 rounded-2xl text-center my-12">
      <h3 class="text-2xl font-bold mb-4">¿Tu celular necesita arreglo?</h3>
      <p class="mb-6 text-gray-300">No dejes que un celular roto te frene. Acercate a nuestro local en Marcos Paz o consultanos por WhatsApp.</p>
      <a href="https://wa.me/541125960900" class="btn btn-primary btn-lg gap-2">
        <i class="fab fa-whatsapp"></i> Consultar Ahora
      </a>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Ubicación y Horarios</h2>
    <p class="text-gray-700 mb-4">
      Estamos ubicados en el corazón de <strong>Marcos Paz</strong>. Vení a visitarnos y conocé nuestro taller equipado con la última tecnología.
    </p>
    <p class="text-gray-700">
      <strong>Horario de Atención:</strong><br>
      Lunes a Viernes: 9:00 - 13:00 y 16:00 - 20:00<br>
      Sábados: 9:00 - 13:00
    </p>
  </div>',
  true,
  'https://images.unsplash.com/photo-1591196702597-062a0e327edb?q=80&w=2070&auto=format&fit=crop',
  'Servicio Técnico de Celulares en Marcos Paz | Reparación en el Acto',
  'Servicio técnico especializado en Marcos Paz. Reparación de celulares, cambio de pantalla, batería y pin de carga. Presupuesto sin cargo y garantía escrita. ¡Consultanos!'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  published = EXCLUDED.published,
  image = EXCLUDED.image,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  updated_at = NOW();
