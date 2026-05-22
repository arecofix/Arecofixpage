export interface AppServiceEntity {
    id: string;
    tenant_id?: string;
    name: string;
    slug?: string;
    description?: string;
    estimated_time?: string;
    image_url?: string;
    price: number;
    duration_minutes: number;
    category_id?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export type CreateAppServiceDto = Omit<AppServiceEntity, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAppServiceDto = Partial<CreateAppServiceDto>;
