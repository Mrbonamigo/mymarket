import { createContext, useState, type ReactNode, useContext } from 'react';
import { type Product } from '../types';


interface CartContextType {
    cart: Product[];
    addToCart: (product: Product) => Promise<void>; // Updated to be async
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    total: number;
}


const CartContext = createContext<CartContextType | undefined>(undefined);


export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Product[]>([]);


    const addToCart = async (product: Product) => {
        try {

            const response = await fetch('http://localhost:3000/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2Njk0NTcyOCwiZXhwIjoxNzY2OTQ5MzI4fQ.r34wQD8EqztD4RYq7r64tJhOvpB0cNDrdJUQfhf6FGo
`                },

                body: JSON.stringify({
                    product_id: product.id,
                    quantity: 1
                })
            });


            if (response.ok) {
                setCart([...cart, product]);
                console.log('Product added to database and UI!');
            } else {
                console.error('Failed to add to cart on server.');
            }

        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    const total = cart.reduce((acc, item) => {
        return acc + Number(item.price);
    }, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}


export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}