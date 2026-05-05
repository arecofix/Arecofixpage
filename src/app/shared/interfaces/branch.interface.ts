// -------------------------------------------------------
// Interfaces para la Landing Page dinámica de la sucursal
// Se almacena en branches.modules_config (JSONB)
// -------------------------------------------------------

export interface BranchServiceCard {
  id: string;          // ej. 'electricidad'
  icon: string;        // emoji o clase CSS
  title: string;       // ej. 'Electricidad'
  description: string; // Texto libre editable desde admin
}

export interface BranchHighlight {
  icon: string;  // emoji
  label: string; // texto corto
}

export interface BranchLandingConfig {
  // Módulos de sección (activan/desactivan bloques de la landing)
  has_catalog?: boolean;   // muestra la grilla de productos
  has_services?: boolean;  // muestra la sección de servicios/cards
  has_about?: boolean;     // muestra la sección quiénes somos

  // Sección Hero
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_label?: string;

  // Sección Quiénes Somos
  about_title?: string;
  about_text?: string;

  // Badges destacados debajo del hero
  highlights?: BranchHighlight[];

  // Grilla de servicios (cards editables)
  service_cards?: BranchServiceCard[];

  // Sección Contacto
  contact_title?: string;
  contact_subtitle?: string;
  contact_area?: string; // ej. 'CABA y Gran Bs. As.'

  // Módulos heredados (compatibilidad hacia atrás)
  dashboard?: boolean;
  repairs?: boolean;
  inventory?: boolean;
  customers?: boolean;
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  is_active: boolean;
  global_markup_percentage: number;
  plan_id?: 'basic' | 'premium' | 'custom';
  official_name?: string;
  contact_email?: string;
  contact_phone?: string;
  whatsapp_number?: string;
  bank_info?: {
    alias?: string;
    cbu?: string;
    bank?: string;
  };
  tax_id?: string;
  branding_settings?: {
    logo_url: string | null;
    favicon_url: string | null;
    primary_color: string;
    owner_name?: string;
  };
  // modules_config ahora es tipado con BranchLandingConfig completo
  modules_config?: BranchLandingConfig;
  tenant_id?: string;
  created_at?: string;
  updated_at?: string;
}
