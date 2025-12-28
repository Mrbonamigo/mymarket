import { z } from 'zod';

// 1. Schema Definition (The rules)
export const userSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),

    // Trims whitespace before validation, then checks email format
    email: z.string().trim().email("Invalid email format"),

    password: z.string().min(6, "Password must be at least 6 characters long"),

    // Defines allowed values. If missing, defaults to "guest"
    role: z.enum(["admin", "user", "guest"]).default("guest"),
});

// 2. TypeScript Type Inference (Automatic)
type User = z.infer<typeof userSchema>;

// 3. Usage Simulation (Validating data)
function validateUser(input: unknown) {
    const result = userSchema.safeParse(input);

    if (result.success) {
        // TypeScript knows 'data' is of the correct 'User' type here
        const user: User = result.data;
        console.log("✅ Valid data:", user);
        return user;
    } else {
        console.error("❌ Validation error:", result.error.format());
        return null;
    }
}

// Example usage
const newUser = validateUser({
    name: "Ana",
    email: " ana@example.com ", // .trim() will clean this
    password: "123456",
    // role: undefined -> .default("guest") will fill this in
});