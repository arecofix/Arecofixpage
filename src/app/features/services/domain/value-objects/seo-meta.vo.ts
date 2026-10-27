export interface SeoMetaProps {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
  ogImageUrl?: string | null;
  fallbackName?: string;
  fallbackDescription?: string;
}

export class SeoMeta {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: string | null;
  readonly ogImageUrl: string | null;

  constructor(props: SeoMetaProps) {
    const rawTitle = (props.title || '').trim();
    const fallbackTitle = props.fallbackName
      ? `${props.fallbackName} | Arecofix`
      : 'Servicios | Arecofix';
    const computedTitle = rawTitle.length > 0 ? rawTitle : fallbackTitle;
    this.title = computedTitle.slice(0, 70);

    const rawDesc = (props.description || '').trim();
    const fallbackDesc = props.fallbackDescription
      ? props.fallbackDescription.slice(0, 160)
      : 'Servicios profesionales y soluciones tecnológicas por Arecofix.';
    const computedDesc = rawDesc.length > 0 ? rawDesc : fallbackDesc;
    this.description = computedDesc.slice(0, 160);

    this.canonicalUrl = props.canonicalUrl?.trim() || null;
    this.ogImageUrl = props.ogImageUrl?.trim() || null;
  }

  static create(props: SeoMetaProps): SeoMeta {
    return new SeoMeta(props);
  }
}
