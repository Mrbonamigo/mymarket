import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {

    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);

            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log("Error reading localStorage:", error);
            return initialValue;
        }
    });


    useEffect(() => {
        try {

            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log("Error saving to localStorage:", error);
        }
    }, [key, value]);

    return [value, setValue];
}