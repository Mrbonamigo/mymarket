import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js'; // Precisamos importar o porteiro aqui!
import { z } from 'zod';
import { userSchema } from '../schemas/user.schema.js';
const router = Router();
import bcrypt from "bcrypt";
import {query} from "../db.js";
import jwt from "jsonwebtoken";


router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to your secret profile!', user: (req as any).user });
});


router.post('/signup', async (req, res) => {

    const result = userSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.format()
        });
    }

    const validatedData = result.data;

    try {

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);


        const newUser = await query(
            'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
            [validatedData.email, hashedPassword, validatedData.role]
        );


        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: newUser.rows[0].id,
                email: newUser.rows[0].email,
                role: validatedData.role
            }
        });

    } catch (error) {
        console.error("Erro no cadastro:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;


    try {

        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];


        if (!user) {

            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (isMatch) {
            // 1. Create the badge (token) 🎫
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );

            // 2. Open the door and send the token ✨
            return res.status(200).json({
                message: 'Login successful!',
                token: token
            });
        } else {
            // 3. The key is wrong! ❌
            return res.status(401).json({ message: 'Invalid email or password' });
        }


        // ... more code coming soon!
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    // Rota de DEBUG: Apenas para testes!

});
router.get('/admin/dashboard', authenticateToken, (req, res) => {
    // Retrieve the user data decoded by the 'authenticateToken' middleware
    const user = (req as any).user;

    // THE ROYAL GUARD 🛡️
    // If the user's role is NOT 'admin', we block access immediately.
    if (user.role !== 'admin') {
        return res.status(403).json({
            message: 'Access denied. This area is restricted to administrators.'
        });
    }

    // If execution reaches here, the user is an admin!
    res.json({
        message: 'Welcome to the VIP Area, Boss! 🎩',
        data: {
            revenue: 1000000,
            secretPlans: 'Dominate the coffee world'
        }
    });
});
export default router;