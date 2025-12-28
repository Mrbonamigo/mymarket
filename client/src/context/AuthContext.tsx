import { createContext, useState, type ReactNode, useContext } from 'react';
import { type User } from '../types';

// 1. The Contract: What data and functions do we provide?
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Initialize state from localStorage if available (so F5 doesn't log you out!)
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("authToken");
    });

    const login = (newToken: string, newUser: User) => {
        // 1. Update React State (RAM)
        setToken(newToken);
        setUser(newUser);

        // 2. Persist in Browser (Hard Drive)
        localStorage.setItem("authToken", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
    };

    const logout = () => {
        // 1. Clear React State
        setUser(null);
        setToken(null);

        // 2. Clear Browser Storage
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}