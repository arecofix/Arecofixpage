import { BlockType } from './block-schemas';
import { LeadStatus } from '../entities/service-lead.entity';

export interface ServiceDto {
  id: string;
  name: string;
  slug: string;
  category_id?: string | null;
  category_name?: string | null;
  icon?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  base_price?: number | null;
  price_formatted: string;
  price_currency: string;
  duration_minutes?: number | null;
  is_quotable: boolean;
  is_bookable: boolean;
  is_published: boolean;
  template_slug: string;
  hero_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  og_image_url?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  features?: string[];
  leads_count?: number;
}

export interface ServiceBlockDto {
  id: string;
  owner_type: 'service' | 'post';
  owner_id: string;
  block_type: BlockType;
  content: Record<string, any>;
  order_index: number;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServicePublicDto {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  short_description: string;
  long_description?: string | null;
  base_price?: number | null;
  price_formatted: string;
  price_currency: string;
  duration_minutes?: number | null;
  is_quotable: boolean;
  is_bookable: boolean;
  template_slug: string;
  hero_image_url?: string | null;
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  og_image_url?: string | null;
  published_at?: string | null;
  features: Array<{ id: string; label: string; icon?: string | null }>;
  blocks: ServiceBlockDto[];
  schema_org: Record<string, any>;
}

export interface CreateLeadDto {
  service_id?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  message: string;
  source?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  hp_field?: string; // honeypot
  turnstile_token?: string;
}

export interface LeadDto {
  id: string;
  service_id?: string | null;
  service_name?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  message: string;
  source: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  status: LeadStatus;
  created_at: string;
  contacted_at?: string | null;
}
