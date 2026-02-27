export interface iCategoriesResponse {
    first: number;
    prev:  null | number;
    next:  null | number;
    last:  number;
    pages: number;
    items: number;
    data:  iCategory[];
}

export interface iCategory {
    id:          string;
    name:        string;
    description: string;
    icon?:       string;
    slug:        string;
    featured?:   boolean;
    parent_id?:  string;
    type?:       'product' | 'course' | 'service';
    is_active?:  boolean;
    image_url?:  string;
    tenant_id?:  string;
}
