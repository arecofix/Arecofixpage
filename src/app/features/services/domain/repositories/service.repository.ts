import { Service, ServiceProps } from '../entities/service.entity';
import { ServiceFeature } from '../entities/service-feature.entity';

export interface ServiceFilterOptions {
  categoryId?: string;
  isPublished?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export abstract class ServiceRepository {
  abstract getAll(options?: ServiceFilterOptions): Promise<{ data: Service[]; total: number }>;
  abstract getPublicList(): Promise<Service[]>;
  abstract getById(id: string): Promise<Service | null>;
  abstract getBySlug(slug: string): Promise<Service | null>;
  abstract create(service: Partial<ServiceProps>, features?: string[]): Promise<Service>;
  abstract update(id: string, service: Partial<ServiceProps>, features?: string[]): Promise<Service>;
  abstract delete(id: string): Promise<void>;
  abstract getFeatures(serviceId: string): Promise<ServiceFeature[]>;
  abstract setFeatures(serviceId: string, features: Array<{ label: string; icon?: string }>): Promise<ServiceFeature[]>;
  abstract findRedirect(oldSlug: string, entityType?: 'service' | 'post'): Promise<string | null>;
  abstract createRedirect(entityType: 'service' | 'post', entityId: string, oldSlug: string, newSlug: string): Promise<void>;
}
