import bcrypt from "bcrypt";
import express, { type Express, type Request, type Response } from 'express';
import { query } from '../db.js'
import {id} from "zod/locales";

const app: Express = express();
app.use(express.json());

const saltRounds = 10;

export const hashPassword = async (plainPassword: string): Promise<string> => {
    try {
        const hash = await bcrypt.hash(plainPassword, saltRounds);
        return hash;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Security process failed');
    }
};


app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = await query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword]
    );
    res.status(201).json({ id: newUser.rows[0].id, email: newUser.rows[0].email });
    try {

        const checkUser = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (checkUser.rows.length > 0) {

            return res.status(400).json({ message: 'Email already in use' });
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});