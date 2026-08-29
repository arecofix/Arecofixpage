
import re

sql = """
CREATE TABLE public.auth_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action character varying NOT NULL,
  ip_address inet,
  user_agent text,
  status character varying DEFAULT 'success'::character varying,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  CONSTRAINT auth_logs_pkey PRIMARY KEY (id),
  CONSTRAINT auth_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT fk_auth_logs_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  bio text,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  role text DEFAULT 'user'::text CHECK (role = ANY (ARRAY['user'::text, 'admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text, 'technician'::text])),
  address text,
  dni text,
  cuit_cuil text,
  branch_id uuid,
  tenant_id uuid DEFAULT get_my_tenant(),
  deleted_at timestamp with time zone,
  is_guest boolean DEFAULT false,
  referral_code text UNIQUE,
  points integer DEFAULT 0,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT profiles_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT profiles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.brands (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  logo_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  branch_id uuid,
  CONSTRAINT brands_pkey PRIMARY KEY (id),
  CONSTRAINT brands_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT brands_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.models (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  brand_id uuid,
  name text NOT NULL,
  slug text NOT NULL,
  release_year integer,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  deleted_at timestamp with time zone,
  CONSTRAINT models_pkey PRIMARY KEY (id),
  CONSTRAINT models_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id),
  CONSTRAINT fk_models_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  type text NOT NULL CHECK (type = ANY (ARRAY['product'::text, 'course'::text, 'service'::text])),
  image_url text,
  parent_id uuid,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  branch_id uuid,
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id),
  CONSTRAINT categories_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT categories_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sku text,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0::numeric),
  sale_price numeric,
  min_stock_alert integer DEFAULT 5 CHECK (min_stock_alert >= 0),
  category_id uuid,
  brand_id uuid,
  model_id uuid,
  image_url text,
  gallery_urls jsonb DEFAULT '[]'::jsonb,
  specifications jsonb,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  barcode character varying,
  currency text DEFAULT 'ARS'::text,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  is_global boolean DEFAULT false,
  deleted_at timestamp with time zone,
  cost_price numeric DEFAULT 0,
  search_tsv tsvector DEFAULT ((setweight(to_tsvector('spanish'::regconfig, COALESCE(name, ''::text)), 'A'::"char") || setweight(to_tsvector('spanish'::regconfig, COALESCE(description, ''::text)), 'B'::"char")) || setweight(to_tsvector('spanish'::regconfig, (COALESCE(barcode, ''::character varying))::text), 'C'::"char")),
  media_metadata jsonb DEFAULT '[]'::jsonb,
  stock integer DEFAULT 0,
  branch_id uuid,
  total_units_sold integer DEFAULT 0,
  meta_title text,
  meta_description text,
  og_image text,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT products_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id),
  CONSTRAINT products_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  short_description text,
  duration text,
  schedule text,
  level text CHECK (level = ANY (ARRAY['basic'::text, 'intermediate'::text, 'advanced'::text, 'all_levels'::text])),
  price numeric NOT NULL,
  sale_price numeric,
  image_url text,
  instructor_name text,
  start_date date,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  syllabus jsonb,
  benefits jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  instructor_id uuid,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  classes_count integer DEFAULT 0,
  hours_content integer DEFAULT 0,
  hours_practice integer DEFAULT 0,
  hours_per_week text,
  instructor_role text,
  instructor_bio text,
  instructor_avatar text,
  audience_list jsonb DEFAULT '[]'::jsonb,
  reviews_count integer DEFAULT 0,
  author_id uuid,
  CONSTRAINT courses_pkey PRIMARY KEY (id),
  CONSTRAINT courses_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id),
  CONSTRAINT courses_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.profiles(id),
  CONSTRAINT courses_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  slug text,
  description text,
  estimated_time text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  duration_minutes integer DEFAULT 0,
  price numeric DEFAULT 0,
  category_id uuid,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  branch_id uuid,
  CONSTRAINT services_pkey PRIMARY KEY (id),
  CONSTRAINT services_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT fk_svc_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.customer_devices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  model_id uuid,
  serial_number text,
  imei text,
  passcode text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  deleted_at timestamp with time zone,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  type character varying DEFAULT 'Celular'::character varying,
  CONSTRAINT customer_devices_pkey PRIMARY KEY (id),
  CONSTRAINT customer_devices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT customer_devices_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id),
  CONSTRAINT fk_cd_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_number character varying NOT NULL,
  user_id uuid,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['cart'::text, 'pending'::text, 'pending_payment'::text, 'awaiting_verification'::text, 'paid'::text, 'preparing'::text, 'shipped'::text, 'completed'::text, 'cancelled'::text])),
  total_amount numeric NOT NULL,
  payment_method text,
  shipping_address jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  notes text,
  discount numeric DEFAULT 0,
  tax numeric DEFAULT 0,
  subtotal numeric DEFAULT 0,
  total numeric DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  invoice_url text,
  invoice_generated boolean DEFAULT false,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  deleted_at timestamp with time zone,
  customer_name text,
  customer_email text,
  customer_phone text,
  branch_id uuid,
  session_id text,
  payment_proof_url text,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT orders_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid,
  product_id uuid,
  course_id uuid,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  unit_price numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  product_name character varying,
  product_sku character varying,
  subtotal numeric DEFAULT 0,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  unit_cost_at_time numeric DEFAULT 0,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT order_items_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$'::text),
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  phone text,
  subject text,
  is_read boolean DEFAULT false,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  branch_id uuid,
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id),
  CONSTRAINT contact_messages_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT contact_messages_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.suppliers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_name text,
  email text CHECK (email IS NULL OR email = ''::text OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$'::text),
  phone text,
  address text,
  tax_id text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  type text,
  rubro text,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  branch_id uuid,
  CONSTRAINT suppliers_pkey PRIMARY KEY (id),
  CONSTRAINT suppliers_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT suppliers_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  supplier_id uuid,
  date timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  total_amount numeric DEFAULT 0,
  status text DEFAULT 'completed'::text CHECK (status = ANY (ARRAY['received'::text, 'ordered'::text, 'pending'::text, 'cancelled'::text, 'completed'::text])),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  deleted_at timestamp with time zone,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  payment_method text DEFAULT 'cash'::text,
  branch_id uuid,
  CONSTRAINT purchases_pkey PRIMARY KEY (id),
  CONSTRAINT purchases_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id),
  CONSTRAINT purchases_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT purchases_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
CREATE TABLE public.purchase_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  purchase_id uuid,
  product_id uuid,
  quantity integer NOT NULL,
  unit_cost numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  CONSTRAINT purchase_items_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_items_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES public.purchases(id),
  CONSTRAINT purchase_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT fk_pur_items_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  invoice_number integer,
  customer_name text,
  customer_tax_id text,
  customer_address text,
  total_amount numeric NOT NULL,
  issued_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  pdf_url text,
  type character varying DEFAULT 'B'::character varying,
  order_id uuid,
  repair_id uuid,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  deleted_at timestamp with time zone,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  tax_amount numeric DEFAULT 0,
  net_amount numeric DEFAULT 0,
  origin text NOT NULL DEFAULT 'sale'::text CHECK (origin = ANY (ARRAY['sale'::text, 'order'::text, 'manual'::text, 'repair'::text])),
  subtotal numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  customer_id uuid,
  customer_email text,
  CONSTRAINT invoices_pkey PRIMARY KEY (id),
  CONSTRAINT invoices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT invoices_repair_id_fkey FOREIGN KEY (repair_id) REFERENCES public.repairs(id),
  CONSTRAINT invoices_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT invoices_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.repairs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  issue_description text,
  estimated_cost numeric CHECK (estimated_cost >= 0::numeric),
  final_cost numeric CHECK (final_cost >= 0::numeric),
  technician_notes text,
  received_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at timestamp with time zone,
  current_status_id integer DEFAULT 1,
  whatsapp_notifications boolean DEFAULT true,
  tracking_code text DEFAULT ('AF-'::text || lpad((nextval('repair_tracking_seq'::regclass))::text, 3, '0'::text)) UNIQUE,
  checklist jsonb DEFAULT '{}'::jsonb,
  security_pin text,
  security_pattern text,
  deposit_amount numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  repair_number integer,
  client_id uuid,
  technical_report text,
  device_id uuid,
  branch_id uuid,
  received_by uuid,
  assigned_technician_id uuid,
  technical_labor_cost numeric DEFAULT 0,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant() CHECK (tenant_id IS NOT NULL),
  deleted_at timestamp with time zone,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  glass_upsell boolean DEFAULT false,
  spare_part_cost numeric DEFAULT 0,
  warranty text,
  supplier_id uuid,
  CONSTRAINT repairs_pkey PRIMARY KEY (id),
  CONSTRAINT repairs_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id),
  CONSTRAINT repairs_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT repairs_current_status_id_fkey FOREIGN KEY (current_status_id) REFERENCES public.repair_status_types(id),
  CONSTRAINT repairs_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.customer_devices(id),
  CONSTRAINT repairs_received_by_fkey FOREIGN KEY (received_by) REFERENCES public.profiles(id),
  CONSTRAINT repairs_assigned_technician_id_fkey FOREIGN KEY (assigned_technician_id) REFERENCES public.profiles(id),
  CONSTRAINT repairs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT repairs_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.course_modules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid,
  title text NOT NULL,
  description text,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  unlock_date timestamp with time zone,
  CONSTRAINT course_modules_pkey PRIMARY KEY (id),
  CONSTRAINT fk_cmodule_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT course_modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.repair_status_types (
  id integer NOT NULL DEFAULT nextval('repair_status_types_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  description text,
  color character varying NOT NULL,
  icon character varying NOT NULL,
  order_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT repair_status_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.repair_status_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  repair_id uuid NOT NULL,
  status_type_id integer NOT NULL,
  notes text,
  changed_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  CONSTRAINT repair_status_history_pkey PRIMARY KEY (id),
  CONSTRAINT repair_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.profiles(id),
  CONSTRAINT repair_status_history_repair_id_fkey FOREIGN KEY (repair_id) REFERENCES public.repairs(id),
  CONSTRAINT repair_status_history_status_type_id_fkey FOREIGN KEY (status_type_id) REFERENCES public.repair_status_types(id),
  CONSTRAINT fk_rsh_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.blog_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  slug character varying NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  CONSTRAINT blog_categories_pkey PRIMARY KEY (id),
  CONSTRAINT blog_categories_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.blog_tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  slug character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blog_tags_pkey PRIMARY KEY (id),
  CONSTRAINT blog_tags_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  slug character varying NOT NULL,
  content text NOT NULL,
  excerpt character varying,
  author character varying,
  featured_image text,
  category_id uuid,
  status character varying DEFAULT 'draft'::character varying,
  view_count integer DEFAULT 0,
  seo_title character varying,
  seo_description character varying,
  seo_keywords character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  template character varying DEFAULT 'modern'::character varying,
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id),
  CONSTRAINT blog_posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.blog_categories(id),
  CONSTRAINT blog_posts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.pages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  slug character varying NOT NULL,
  content text NOT NULL,
  page_type character varying DEFAULT 'page'::character varying,
  status character varying DEFAULT 'draft'::character varying,
  seo_title character varying,
  seo_description character varying,
  seo_keywords character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  CONSTRAINT pages_pkey PRIMARY KEY (id),
  CONSTRAINT fk_pages_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.page_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  layout_type character varying,
  sections jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  CONSTRAINT page_templates_pkey PRIMARY KEY (id),
  CONSTRAINT fk_pt_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.course_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'rejected'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  user_id uuid,
  CONSTRAINT course_enrollments_pkey PRIMARY KEY (id),
  CONSTRAINT course_enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT course_enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT fk_ce_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.blog_post_tags (
  post_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blog_post_tags_pkey PRIMARY KEY (post_id, tag_id),
  CONSTRAINT blog_post_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.blog_tags(id),
  CONSTRAINT blog_post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.blog_posts(id),
  CONSTRAINT fk_bpt_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.product_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid,
  image_url text NOT NULL,
  alt_text character varying,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT fk_pi_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.repair_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  repair_id uuid,
  image_url text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  CONSTRAINT repair_images_pkey PRIMARY KEY (id),
  CONSTRAINT repair_images_repair_id_fkey FOREIGN KEY (repair_id) REFERENCES public.repairs(id),
  CONSTRAINT fk_ri_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.repair_parts_used (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  repair_id uuid,
  product_id uuid,
  quantity integer DEFAULT 1,
  unit_price_at_time numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  cost_at_time numeric NOT NULL DEFAULT 0,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  unit_cost_at_time numeric DEFAULT 0,
  CONSTRAINT repair_parts_used_pkey PRIMARY KEY (id),
  CONSTRAINT repair_parts_used_repair_id_fkey FOREIGN KEY (repair_id) REFERENCES public.repairs(id),
  CONSTRAINT fk_rpu_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT repair_parts_used_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.branches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  is_active boolean DEFAULT true,
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  slug text UNIQUE,
  global_markup_percentage numeric DEFAULT 0,
  modules_config jsonb DEFAULT '{}'::jsonb,
  plan_id text,
  branding_settings jsonb DEFAULT '{"logo_url": null, "favicon_url": null, "primary_color": "#3b82f6"}'::jsonb,
  contact_email text,
  contact_phone text,
  tax_id text,
  official_name text,
  whatsapp_number text,
  bank_info jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT branches_pkey PRIMARY KEY (id),
  CONSTRAINT branches_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.product_stock_per_branch (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid,
  branch_id uuid,
  quantity integer DEFAULT 0 CHECK (quantity >= 0),
  min_stock_alert integer DEFAULT 2,
  updated_at timestamp with time zone DEFAULT now(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  CONSTRAINT product_stock_per_branch_pkey PRIMARY KEY (id),
  CONSTRAINT product_stock_per_branch_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT product_stock_per_branch_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT product_stock_per_branch_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.tenants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  plan_type text DEFAULT 'basic'::text CHECK (plan_type = ANY (ARRAY['basic'::text, 'premium'::text, 'enterprise'::text])),
  custom_domain text UNIQUE,
  branding_settings jsonb DEFAULT '{"logo_url": null, "favicon_url": null, "primary_color": "#3b82f6"}'::jsonb,
  owner_id uuid,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  currency text DEFAULT 'ARS'::text,
  tax_percentage numeric DEFAULT 21,
  tax_abbreviation text DEFAULT 'IVA'::text,
  tax_id_name text DEFAULT 'CUIT/CUIL'::text,
  location text,
  contact_phone text,
  contact_email text,
  tax_id text,
  owner_name text,
  CONSTRAINT tenants_pkey PRIMARY KEY (id),
  CONSTRAINT tenants_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  user_id uuid,
  title character varying NOT NULL,
  message text NOT NULL,
  type character varying DEFAULT 'info'::character varying,
  link character varying,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  branch_id uuid,
  scope character varying DEFAULT 'user'::character varying CHECK (scope::text = ANY (ARRAY['user'::character varying, 'admin'::character varying]::text[])),
  source text,
  payload jsonb,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT fk_notifications_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.product_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  product_id uuid NOT NULL,
  user_name text NOT NULL,
  comment text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT product_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT fk_pr_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.cash_movements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  branch_id uuid,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['income'::text, 'expense'::text])),
  category text NOT NULL CHECK (category = ANY (ARRAY['sale'::text, 'purchase'::text, 'repair'::text, 'adjustment'::text, 'draw'::text, 'scholarship'::text, 'external_salary'::text, 'fixed_expense'::text, 'petty_expense'::text, 'investment'::text, 'other'::text])),
  payment_method text DEFAULT 'cash'::text,
  reference_id uuid,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  is_fixed boolean DEFAULT false,
  CONSTRAINT cash_movements_pkey PRIMARY KEY (id),
  CONSTRAINT cash_movements_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT cash_movements_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fk_cm_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  changed_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES auth.users(id),
  CONSTRAINT fk_al_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.technical_solutions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  title text NOT NULL,
  problem_description text NOT NULL,
  solution_steps text NOT NULL,
  tags ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  search_tsv tsvector DEFAULT ((setweight(to_tsvector('spanish'::regconfig, COALESCE(title, ''::text)), 'A'::"char") || setweight(to_tsvector('spanish'::regconfig, COALESCE(problem_description, ''::text)), 'B'::"char")) || setweight(to_tsvector('spanish'::regconfig, COALESCE(solution_steps, ''::text)), 'C'::"char")),
  CONSTRAINT technical_solutions_pkey PRIMARY KEY (id),
  CONSTRAINT fk_ts_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.bank_reconciliations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  bank_name text DEFAULT 'Santander'::text,
  transaction_id text NOT NULL,
  amount numeric NOT NULL,
  status text DEFAULT 'unmatched'::text,
  matched_invoice_id uuid,
  reconciliation_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bank_reconciliations_pkey PRIMARY KEY (id),
  CONSTRAINT bank_reconciliations_matched_invoice_id_fkey FOREIGN KEY (matched_invoice_id) REFERENCES public.invoices(id),
  CONSTRAINT fk_br_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.repair_number_sequences (
  tenant_id uuid NOT NULL DEFAULT get_my_tenant(),
  last_value bigint NOT NULL DEFAULT 0,
  CONSTRAINT repair_number_sequences_pkey PRIMARY KEY (tenant_id),
  CONSTRAINT repair_number_sequences_tenant_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.post_comments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  post_id uuid,
  user_name character varying NOT NULL,
  comment text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  status character varying DEFAULT 'approved'::character varying,
  CONSTRAINT post_comments_pkey PRIMARY KEY (id),
  CONSTRAINT post_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.blog_posts(id)
);
CREATE TABLE public.course_instructors (
  course_id uuid NOT NULL,
  instructor_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  assigned_at timestamp with time zone DEFAULT now(),
  CONSTRAINT course_instructors_pkey PRIMARY KEY (course_id, instructor_id),
  CONSTRAINT course_instructors_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT course_instructors_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES auth.users(id)
);
CREATE TABLE public.course_lessons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['video'::text, 'image'::text, 'document'::text, 'link'::text, 'text'::text])),
  title text,
  url text,
  metadata jsonb,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT course_lessons_pkey PRIMARY KEY (id),
  CONSTRAINT course_lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.course_modules(id),
  CONSTRAINT course_module_contents_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.course_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  email text NOT NULL,
  course_id uuid NOT NULL,
  content_id uuid NOT NULL,
  completed_at timestamp with time zone DEFAULT now(),
  user_id uuid,
  CONSTRAINT course_progress_pkey PRIMARY KEY (id),
  CONSTRAINT course_progress_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT course_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT course_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT course_progress_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.course_lessons(id)
);
CREATE TABLE public.course_certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  course_id uuid NOT NULL,
  email text NOT NULL,
  student_name text NOT NULL,
  issued_at timestamp with time zone DEFAULT now(),
  user_id uuid,
  pdf_url text,
  student_dni text,
  CONSTRAINT course_certificates_pkey PRIMARY KEY (id),
  CONSTRAINT course_certificates_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT course_certificates_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT course_certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.knowledge_base (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  source_type text NOT NULL CHECK (source_type = ANY (ARRAY['product'::text, 'service'::text, 'manual'::text, 'course'::text, 'faq'::text, 'blog'::text, 'custom'::text])),
  source_id uuid,
  source_url text,
  title text NOT NULL,
  content text NOT NULL,
  chunk_index integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  embedding vector(768),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT knowledge_base_pkey PRIMARY KEY (id),
  CONSTRAINT knowledge_base_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
"""

tables = []
alter_statements = []

for table_block in re.split(r'CREATE TABLE ', sql)[1:]:
    table_name = table_block.split('(')[0].strip()
    
    lines = table_block.split('\n')
    new_lines = []
    
    for i, line in enumerate(lines):
        if 'CONSTRAINT' in line and 'FOREIGN KEY' in line:
            constraint = line.strip().rstrip(',')
            alter_statements.append(f"ALTER TABLE {table_name} ADD {constraint};")
        else:
            new_lines.append(line)
            
    # Remove trailing comma from the last column before the closing parenthesis
    for j in range(len(new_lines) - 1, -1, -1):
        if new_lines[j].strip().endswith(','):
            if any(')' in l for l in new_lines[j+1:]):
                new_lines[j] = new_lines[j].rstrip().rstrip(',')
                break

    tables.append('CREATE TABLE ' + '\n'.join(new_lines))

final_sql = """
CREATE SEQUENCE IF NOT EXISTS public.repair_tracking_seq;
CREATE SEQUENCE IF NOT EXISTS public.repair_status_types_id_seq;

CREATE OR REPLACE FUNCTION public.get_my_tenant() RETURNS uuid
    LANGUAGE plpgsql
    AS $$ 
BEGIN 
  RETURN '00000000-0000-0000-0000-000000000000'::uuid; 
END; 
$$;

""" + '\n\n'.join(tables) + "\n\n" + '\n'.join(alter_statements)

with open("c:/Users/ezequ/Desktop/Utilidades/Trabajo/apps/Arecofixpage/supabase/migrations/20260812000000_init.sql", "w") as f:
    f.write(final_sql)

print("SQL file generated successfully!")
