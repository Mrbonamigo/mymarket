import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importing our new context
import { useNavigate } from 'react-router-dom';

export default function Login() {
    // 1. States to hold user input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 2. Hooks for navigation and authentication
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Stop the form from reloading the page

        try {
            // 3. Send credentials to the Backend 📤
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();

                // If login is successful, use the Context function!
                login(data.token, data.user);

                alert('Login successful! 🎉');
                navigate('/'); // Redirect to Home
            } else {
                alert('Invalid credentials ❌');
            }

        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {/* Email Field */}
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>

                {/* Password Field */}
                <div className="mb-6">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}