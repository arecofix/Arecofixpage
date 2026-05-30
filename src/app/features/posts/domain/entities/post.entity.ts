export interface Post {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    slug: string;
    content: string;
    image?: string;
    published: boolean;
    status?: string;
    meta_title?: string;
    meta_description?: string;
    author_id?: string;
}
