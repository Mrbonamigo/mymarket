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

    const { name, email, password, address, phone } = req.body;

    try {
        const hashedPassword = await hashPassword(password);


        const insertQuery = 'INSERT INTO users (name, email, password_hash, address, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, name';


        const result = await query(insertQuery, [name, email, hashedPassword, address, phone]);

        res.status(201).json({
            message: 'User registered successfully!',
            user: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const result = await query(userQuery, [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const user = result.rows[0];


        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, secretKey!, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, address: user.address, phone: user.phone } });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
);



    app.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to your secret profile!', user: (req as any).user });
});


app.get('/', (req, res) => {
    res.send('Welcome to MyMarket API! Go to /products to see the items.');
});





app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});