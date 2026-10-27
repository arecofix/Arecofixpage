import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';
import { Service, ServiceProps } from '../../domain/entities/service.entity';
import { ServiceFeature } from '../../domain/entities/service-feature.entity';
import { ServiceFilterOptions, ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceMapper } from '../../application/mappers/service.mapper';

@Injectable({
  providedIn: 'root',
})
export class SupabaseServiceRepository implements ServiceRepository {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);

  private get tenantId(): string {
    return this.tenantService.getTenantId();
  }

  async getAll(options?: ServiceFilterOptions): Promise<{ data: Service[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 24;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('services')
      .select('*, service_leads(count)', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    const tid = this.tenantId;
    if (tid) {
      query = query.eq('tenant_id', tid);
    }

    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }

    if (options?.isPublished !== undefined) {
      query = query.eq('is_published', options.isPublished);
    }

    if (options?.search && options.search.trim()) {
      query = query.ilike('name', `%${options.search.trim()}%`);
    }

    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }

    const services = (data || []).map((row: any) => ServiceMapper.toEntity(row));
    return { data: services, total: count || 0 };
  }

  async getPublicList(): Promise<Service[]> {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('is_published', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public services:', error);
      throw error;
    }

    return (data || []).map((row: any) => ServiceMapper.toEntity(row));
  }

  async getById(id: string): Promise<Service | null> {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching service by id ${id}:`, error);
      throw error;
    }

    return data ? ServiceMapper.toEntity(data) : null;
  }

  async getBySlug(slug: string): Promise<Service | null> {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching service by slug ${slug}:`, error);
      throw error;
    }

    return data ? ServiceMapper.toEntity(data) : null;
  }

  async create(service: Partial<ServiceProps>, features?: string[]): Promise<Service> {
    const tid = this.tenantId;
    const dbPayload: any = {
      name: service.name,
      slug: service.slug,
      category_id: service.category_id || null,
      icon: service.icon || 'fa-tools',
      short_description: service.short_description || null,
      long_description: service.long_description || null,
      base_price: service.base_price !== undefined ? service.base_price : null,
      price: service.base_price !== undefined && service.base_price !== null ? service.base_price : 0,
      price_currency: service.price_currency || 'ARS',
      duration_minutes: service.duration_minutes ?? null,
      is_quotable: service.is_quotable ?? true,
      is_bookable: service.is_bookable ?? false,
      is_published: service.is_published ?? false,
      template_slug: service.template_slug || 'landing-v1',
      hero_image_url: service.hero_image_url || null,
      seo_title: service.seo_title || null,
      seo_description: service.seo_description || null,
      canonical_url: service.canonical_url || null,
      og_image_url: service.og_image_url || null,
    };

    if (tid) {
      dbPayload.tenant_id = tid;
    }

    const { data, error } = await this.supabase
      .from('services')
      .insert(dbPayload)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating service in database:', error);
      throw error;
    }

    const created = ServiceMapper.toEntity(data);

    if (features && features.length > 0) {
      await this.setFeatures(created.id, features.map(f => ({ label: f })));
    }

    return created;
  }

  async update(id: string, service: Partial<ServiceProps>, features?: string[]): Promise<Service> {
    const dbPayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (service.name !== undefined) dbPayload.name = service.name;
    if (service.slug !== undefined) dbPayload.slug = service.slug;
    if (service.category_id !== undefined) dbPayload.category_id = service.category_id;
    if (service.icon !== undefined) dbPayload.icon = service.icon;
    if (service.short_description !== undefined) dbPayload.short_description = service.short_description;
    if (service.long_description !== undefined) dbPayload.long_description = service.long_description;
    if (service.base_price !== undefined) {
      dbPayload.base_price = service.base_price;
      dbPayload.price = service.base_price !== null ? service.base_price : 0;
    }
    if (service.price_currency !== undefined) dbPayload.price_currency = service.price_currency;
    if (service.duration_minutes !== undefined) dbPayload.duration_minutes = service.duration_minutes;
    if (service.is_quotable !== undefined) dbPayload.is_quotable = service.is_quotable;
    if (service.is_bookable !== undefined) dbPayload.is_bookable = service.is_bookable;
    if (service.is_published !== undefined) dbPayload.is_published = service.is_published;
    if (service.template_slug !== undefined) dbPayload.template_slug = service.template_slug;
    if (service.hero_image_url !== undefined) dbPayload.hero_image_url = service.hero_image_url;
    if (service.seo_title !== undefined) dbPayload.seo_title = service.seo_title;
    if (service.seo_description !== undefined) dbPayload.seo_description = service.seo_description;
    if (service.canonical_url !== undefined) dbPayload.canonical_url = service.canonical_url;
    if (service.og_image_url !== undefined) dbPayload.og_image_url = service.og_image_url;
    if (service.published_at !== undefined) dbPayload.published_at = service.published_at;
    if (service.deleted_at !== undefined) dbPayload.deleted_at = service.deleted_at;

    const { data, error } = await this.supabase
      .from('services')
      .update(dbPayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating service ${id}:`, error);
      throw error;
    }

    if (features !== undefined) {
      await this.setFeatures(id, features.map(f => ({ label: f })));
    }

    return ServiceMapper.toEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('services')
      .update({ deleted_at: new Date().toISOString(), is_published: false })
      .eq('id', id);

    if (error) {
      console.error(`Error deleting service ${id}:`, error);
      throw error;
    }
  }

  async getFeatures(serviceId: string): Promise<ServiceFeature[]> {
    const { data, error } = await this.supabase
      .from('service_features')
      .select('*')
      .eq('service_id', serviceId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error(`Error fetching features for service ${serviceId}:`, error);
      throw error;
    }

    return (data || []).map((row: any) => new ServiceFeature(row));
  }

  async setFeatures(serviceId: string, features: Array<{ label: string; icon?: string }>): Promise<ServiceFeature[]> {
    // Delete existing features
    await this.supabase.from('service_features').delete().eq('service_id', serviceId);

    if (!features || features.length === 0) return [];

    const rows = features.map((f, idx) => ({
      service_id: serviceId,
      label: f.label,
      icon: f.icon || 'fa-check',
      order_index: idx,
    }));

    const { data, error } = await this.supabase
      .from('service_features')
      .insert(rows)
      .select('*');

    if (error) {
      console.error('Error inserting features:', error);
      throw error;
    }

    return (data || []).map((row: any) => new ServiceFeature(row));
  }

  async findRedirect(oldSlug: string, entityType: 'service' | 'post' = 'service'): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('slug_redirects')
      .select('new_slug')
      .eq('entity_type', entityType)
      .eq('old_slug', oldSlug)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data.new_slug;
  }

  async createRedirect(entityType: 'service' | 'post', entityId: string, oldSlug: string, newSlug: string): Promise<void> {
    if (!oldSlug || !newSlug || oldSlug === newSlug) return;
    const tid = this.tenantId;

    const payload: any = {
      entity_type: entityType,
      entity_id: entityId,
      old_slug: oldSlug,
      new_slug: newSlug,
    };
    if (tid) payload.tenant_id = tid;

    const { error } = await this.supabase
      .from('slug_redirects')
      .upsert(payload, { onConflict: 'tenant_id,entity_type,old_slug' });

    if (error) {
      console.warn('Notice on creating slug redirect:', error.message);
    }
  }
}
