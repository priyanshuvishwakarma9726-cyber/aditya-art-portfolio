export interface Artwork {
    id: string;
    title: string;
    slug: string;
    description: string;
    category_id: number;
    category_name: string;
    price: number;
    is_commission: boolean;
    stock_count: number;
    image_url: string;
    before_image_url: string | null;
    after_image_url: string | null;
    width_cm: number | null;
    height_cm: number | null;
    is_active: boolean;
    created_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
}
