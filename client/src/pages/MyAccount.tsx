import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "../context/AuthContext.tsx";


const EditableField = ({ label, value, onChange, isEditing }) => {
    return (
        <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">{label}:</h3>
            {isEditing ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="border p-2 rounded text-gray-600 w-full"
                />
            ) : (
                <p className="text-gray-600">{value || 'N/A'}</p>
            )}
        </div>
    );
};

export default function MyAccount() {
    // 1. Hooks e Estados
    const { user, logout } = useAuth();
    const [profile, setProfile] = useLocalStorage('userProfile', user || {});
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");


    const handleEdit = () => {
        if (isEditing) {
            setSuccessMessage("Profile updated successfully! ✅");
            setTimeout(() => setSuccessMessage(""), 3000);
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white shadow rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Account Settings</h1>


            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 transition-all">
                    {successMessage}
                </div>
            )}


            <EditableField
                label="Name"
                value={profile.name}
                isEditing={isEditing}
                onChange={(newValue) => setProfile({ ...profile, name: newValue })}
            />

            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Email:</h3>
                <p className="text-gray-600">{user?.email || 'N/A'}</p>
            </div>

            <EditableField
                label="Address"
                value={profile.address}
                isEditing={isEditing}
                onChange={(newValue) => setProfile({ ...profile, address: newValue })}
            />

            <EditableField
                label="Phone"
                value={profile.phone}
                isEditing={isEditing}
                onChange={(newValue) => setProfile({ ...profile, phone: newValue })}
            />

            {/* Botões de Ação */}
            <div className="flex gap-4 mt-6">
                <button
                    onClick={handleEdit}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                    {isEditing ? 'Save Profile' : 'Edit Profile'}
                </button>

                <button
                    onClick={logout}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}