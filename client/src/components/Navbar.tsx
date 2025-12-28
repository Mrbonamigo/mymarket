import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Importing the hook from our context

export default function Navbar() {
    // We access the 'total' directly from our global state (Context)
    // No need to receive it via props anymore!
    const { total } = useCart();

    return (
        <nav className="flex justify-between items-center bg-gray-900 p-4 text-white font-medium">
            {/* Left Section: Logo and Navigation Links */}
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">MyMarket</h1>

                <Link to="/" className="hover:underline hover:text-gray-300">Home</Link>
                <Link to="/categories" className="hover:underline hover:text-gray-300">Categories</Link>
            </div>

            {/* Right Section: Total and Cart Link */}
            <div className="flex items-center gap-4">
                <span className="text-green-400 font-bold">${total.toFixed(2)}</span>
                <Link to="/cart" className="hover:underline hover:text-gray-300">🛒 Cart</Link>
            </div>
        </nav>
    );
}