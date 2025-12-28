import { useState, useEffect } from 'react';


interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image_url: string;
}

export function useProduct(id: string | undefined) {
    const [data, setData] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!id) return;

        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/products/${id}`);

                if (!response.ok) {
                    throw new Error("Product not found");
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred");
                }
            }
        };

        fetchProduct();
    }, [id]);


    return { data, error };
}