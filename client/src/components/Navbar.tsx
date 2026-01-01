import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { total } = useCart();
    const { user, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center bg-gray-900 p-4 text-white font-medium">

            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-white">MyMarket</h1>
                <Link to="/" className="hover:underline hover:text-gray-300">Home</Link>
                <Link to="/categories" className="hover:underline hover:text-gray-300">Categories</Link>
            </div>


            <div className="flex items-center gap-6">

                <div className="flex items-center gap-4">
                    <span className="text-green-400 font-bold">${total.toFixed(2)}</span>
                    <Link to="/cart" className="hover:underline hover:text-gray-300">🛒 Cart</Link>
                </div>


                <div className="flex items-center gap-4 border-l border-gray-700 pl-6">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-gray-300">

                                Hello, <span className="text-white font-semibold">{user?.name?.split(' ')[0]}</span>
                            </span>

                            <Link
                                to="/my-account"
                                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                            >
                                My Account
                            </Link>

                            <button
                                onClick={logout}
                                className="text-red-400 hover:text-red-300 transition-colors text-sm uppercase tracking-wider"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded transition-colors"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}