


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
}

export type { Product };