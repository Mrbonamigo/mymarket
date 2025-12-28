import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js'; // Precisamos importar o porteiro aqui!
import { query } from '../db.js';
const router = Router();

router.get('/products', async (req, res) => {
    try {
        // We ask Postgres for every row in the products table
        const result = await query('SELECT * FROM products');

        // We send the whole list (rows) back to React
        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params; // 1. Get the ID from the URL

        // 2. Query the database using a safe parameter ($1)
        // We compare the column 'id' with the value provided
        const result = await query('SELECT * FROM products WHERE id = $1', [id]);

        // 3. Check if the product exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 4. Return the specific product (the first item in the rows array)
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;