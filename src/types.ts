export type Category = {
    id: number;
    title: string;
};

export type Categories = Category[];

export type Size = {
    size: number | string;
    available: boolean;
};

export type Item = {
    id: number;
    title: string;
    price: number;
    images: string[];
    sku?: string;
    manufacturer?: string;
    color?: string;
    material?: string;
    season?: string;
    sizes: Size[];
};

export type Items = Item[];

export type CartItem = {
    id: number;
    title: string;
    price: number;
    size: string;
    count: number;
    image: string;
};