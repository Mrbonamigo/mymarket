import { useCart } from '../context/CartContext';

function Cart() {

    const { cart, removeFromCart, total, clearCart } = useCart();


    const handleRemoveItem = async (id: number) => {
        try {

            await fetch(`http://localhost:3000/cart/${id}`, {
                method: 'DELETE',
                headers: {

                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2Njk0NTcyOCwiZXhwIjoxNzY2OTQ5MzI4fQ.r34wQD8EqztD4RYq7r64tJhOvpB0cNDrdJUQfhf6FGo`
                }
            });


            removeFromCart(id);

        } catch (error) {
            console.error('Error removing item:', error);
        }
    };


    const handleCheckout = async () => {
        try {

            const response = await fetch('http://localhost:3000/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2Njk0NTcyOCwiZXhwIjoxNzY2OTQ5MzI4fQ.r34wQD8EqztD4RYq7r64tJhOvpB0cNDrdJUQfhf6FGo`
                }
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Success! Order ID: ${data.order.id}`);


                clearCart();
            } else {

                const errorData = await response.json();


                alert(`Checkout Error: ${errorData.error}`);


                console.error('Error details:', errorData);
            }

        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">My Shopping Cart 🛒</h1>

            <div className="space-y-4">

                {cart.length === 0 ? (
                    <p className="text-gray-500">Your cart is empty.</p>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="border p-4 rounded shadow flex justify-between items-center bg-white">
                            <div className="flex items-center gap-4">
                                <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                <div>
                                    <h2 className="text-xl font-bold">{item.name}</h2>
                                    <p className="text-gray-600">${item.price}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">

                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-500 hover:text-red-700 font-bold"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>


            {cart.length > 0 && (
                <div className="mt-8 border-t pt-4 flex flex-col items-end">
                    <div className="text-2xl font-bold text-gray-800">
                        Total: <span className="text-green-600">${total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
                    >
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cart;