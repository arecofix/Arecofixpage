import { Money } from '../value-objects/money.vo';
import { SeoMeta } from '../value-objects/seo-meta.vo';
import { Slug } from '../value-objects/slug.vo';

export interface ServiceProps {
  id: string;
  tenant_id?: string;
  category_id?: string | null;
  name: string;
  slug: string;
  icon?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  base_price?: number | null;
  price_currency?: string;
  duration_minutes?: number | null;
  is_quotable?: boolean;
  is_bookable?: boolean;
  is_published?: boolean;
  template_slug?: string;
  hero_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  og_image_url?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export class Service {
  readonly id: string;
  readonly tenantId?: string;
  categoryId?: string | null;
  name: string;
  private _slug: Slug;
  icon: string | null;
  shortDescription: string;
  longDescription: string | null;
  private _money: Money;
  durationMinutes: number | null;
  isQuotable: boolean;
  isBookable: boolean;
  private _isPublished: boolean;
  templateSlug: string;
  heroImageUrl: string | null;
  private _seoMeta: SeoMeta;
  publishedAt: string | null;
  readonly createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  constructor(props: ServiceProps) {
    this.id = props.id;
    this.tenantId = props.tenant_id;
    this.categoryId = props.category_id || null;
    this.name = (props.name || '').trim();
    this._slug = Slug.create(props.slug || props.name);
    this.icon = props.icon || 'fa-tools';
    this.shortDescription = (props.short_description || '').trim();
    this.longDescription = props.long_description || null;
    this._money = Money.fromNullable(props.base_price, props.price_currency || 'ARS');
    this.durationMinutes = props.duration_minutes ?? null;
    this.isQuotable = props.is_quotable ?? true;
    this.isBookable = props.is_bookable ?? false;
    this._isPublished = props.is_published ?? false;
    this.templateSlug = props.template_slug || 'landing-v1';
    this.heroImageUrl = props.hero_image_url || null;
    this._seoMeta = SeoMeta.create({
      title: props.seo_title,
      description: props.seo_description,
      canonicalUrl: props.canonical_url,
      ogImageUrl: props.og_image_url || props.hero_image_url,
      fallbackName: this.name,
      fallbackDescription: this.shortDescription,
    });
    this.publishedAt = props.published_at || null;
    this.createdAt = props.created_at || new Date().toISOString();
    this.updatedAt = props.updated_at || new Date().toISOString();
    this.deletedAt = props.deleted_at || null;
  }

  get slug(): string {
    return this._slug.getValue();
  }

  setSlug(newSlug: string): void {
    this._slug = Slug.create(newSlug);
    this.touch();
  }

  get isPublished(): boolean {
    return this._isPublished && !this.deletedAt;
  }

  get money(): Money {
    return this._money;
  }

  get basePrice(): number | null {
    return this._money.getAmount();
  }

  setBasePrice(amount: number | null, currency = 'ARS'): void {
    this._money = Money.fromNullable(amount, currency);
    this.touch();
  }

  get seo(): SeoMeta {
    return this._seoMeta;
  }

  updateSeo(title?: string | null, description?: string | null, canonicalUrl?: string | null, ogImageUrl?: string | null): void {
    this._seoMeta = SeoMeta.create({
      title,
      description,
      canonicalUrl,
      ogImageUrl: ogImageUrl || this.heroImageUrl,
      fallbackName: this.name,
      fallbackDescription: this.shortDescription,
    });
    this.touch();
  }

  canPublish(hasHeroBlock = true): { valid: boolean; reason?: string } {
    if (!this.name || this.name.length < 3) {
      return { valid: false, reason: 'El nombre del servicio debe tener al menos 3 caracteres.' };
    }
    if (!this.slug) {
      return { valid: false, reason: 'El slug es obligatorio.' };
    }
    if (!this.shortDescription || this.shortDescription.length < 10) {
      return { valid: false, reason: 'La descripción corta es obligatoria para publicar (mínimo 10 caracteres).' };
    }
    if (!hasHeroBlock) {
      return { valid: false, reason: 'Debe existir y estar habilitado al menos un bloque Hero para publicar.' };
    }
    return { valid: true };
  }

  publish(hasHeroBlock = true): void {
    const check = this.canPublish(hasHeroBlock);
    if (!check.valid) {
      throw new Error(`No se puede publicar: ${check.reason}`);
    }
    this._isPublished = true;
    if (!this.publishedAt) {
      this.publishedAt = new Date().toISOString();
    }
    this.touch();
  }

  unpublish(): void {
    this._isPublished = false;
    this.touch();
  }

  softDelete(): void {
    this.deletedAt = new Date().toISOString();
    this._isPublished = false;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date().toISOString();
  }

  toObject(): ServiceProps {
    return {
      id: this.id,
      tenant_id: this.tenantId,
      category_id: this.categoryId,
      name: this.name,
      slug: this.slug,
      icon: this.icon,
      short_description: this.shortDescription,
      long_description: this.longDescription,
      base_price: this.basePrice,
      price_currency: this._money.getCurrency(),
      duration_minutes: this.durationMinutes,
      is_quotable: this.isQuotable,
      is_bookable: this.isBookable,
      is_published: this.isPublished,
      template_slug: this.templateSlug,
      hero_image_url: this.heroImageUrl,
      seo_title: this._seoMeta.title,
      seo_description: this._seoMeta.description,
      canonical_url: this._seoMeta.canonicalUrl,
      og_image_url: this._seoMeta.ogImageUrl,
      published_at: this.publishedAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }
}
