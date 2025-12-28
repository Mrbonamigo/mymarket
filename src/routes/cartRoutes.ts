import { Router } from 'express';
import { query } from '../db.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();


router.post('/cart', authenticateToken, async (req, res) => {

    const { product_id, quantity } = req.body;


    const user = (req as any).user;

    try {

        const newItem = await query(
            'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [user.id, product_id, quantity]
        );


        res.status(201).json(newItem.rows[0]);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/cart', authenticateToken, async (req, res) => {
    const user = (req as any).user;

    try {
        const result = await query(
            `SELECT
                 c.id, c.quantity,
                 p.name, p.price, p.image_url
             FROM cart_items c
                      JOIN products p ON c.product_id = p.id
             WHERE c.user_id = $1`,
            [user.id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/cart/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const user = (req as any).user;

    try {

        const result = await query(
            'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Item not found or does not belong to you' });
        }

        res.json({ message: 'Item removed successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/checkout', authenticateToken, async (req, res) => {
    const user = (req as any).user;

    try {

        const totalResult = await query(
            `SELECT SUM(p.price * c.quantity) as total
             FROM cart_items c
                      JOIN products p ON c.product_id = p.id
             WHERE c.user_id = $1`,
            [user.id]
        );
        const total = totalResult.rows[0].total;

        if (!total) {
            return res.status(400).json({ error: 'empty cart' });
        }


        const orderResult = await query(
            'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *',
            [user.id, total]
        );
        const newOrder = orderResult.rows[0];


        await query(
            'DELETE FROM cart_items WHERE user_id = $1',
            [user.id]
        );

        res.json({ message: 'Successful request', order: newOrder });

    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Internal Error' });
    }
});

export default router;