import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { query } from './db.js';
import { hashPassword } from './utils/hashPassword.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middlewares/authMiddleware.js';
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";


const app = express();
app.use(cors());
const port = 3000;
app.use(express.json());
app.use('/auth', authRoutes);
app.use(productRoutes);
app.use(cartRoutes);

const secretKey = process.env.JWT_SECRET;

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {

        const checkUser = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (checkUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }


        const hashedPassword = await hashPassword(password);


        const insertQuery = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id';
        const result = await query(insertQuery, [email, hashedPassword]);


        res.status(201).json({
            message: 'User registered successfully!',
            userId: result.rows[0].id
        });

    } catch (error) {

        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// The Login Route



    app.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to your secret profile!', user: (req as any).user });
});


app.get('/', (req, res) => {
    res.send('Welcome to MyMarket API! Go to /products to see the items.');
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});