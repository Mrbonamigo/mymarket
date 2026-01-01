


interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    image_url: string;
}

export interface User {
    id: number;
    email: string;
    role: string;
    name?: string;
    address?: string;
    phone?: string;
}

export type { Product };