import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Importing our custom Hook
import { type Product } from '../types';

function Home() {
    // State to store the list of products fetched from the API
    const [products, setProducts] = useState<Product[]>([]);

    // We use the hook to grab the addToCart function from the global context!
    const { addToCart } = useCart();

    // Effect to fetch products when the component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="border p-4 rounded-xl shadow-2xl bg-white flex flex-col justify-between">
                        <div>
                            {/* Product Image */}
                            <img src={product.image_url} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-4" />

                            {/* Link to Product Details */}
                            <Link to={`/products/${product.id}`}>
                                <h2 className="text-xl font-bold hover:text-blue-500">{product.name}</h2>
                            </Link>

                            {/* Product Description */}
                            <p className="text-gray-600 text-sm">{product.description}</p>
                        </div>

                        <div className="mt-4">
                            <p className="text-green-600 font-bold text-lg">${product.price}</p>

                            {/* Now we call the function coming from the Context */}
                            <button
                                onClick={() => addToCart(product)}
                                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mt-2 w-full transition-all"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;