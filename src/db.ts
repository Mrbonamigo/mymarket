import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;


console.log("🕵️‍♂️ Configuração do Banco:");
console.log("User:", process.env.DB_USER);
console.log("Database:", process.env.DB_DATABASE);
console.log("Port:", process.env.DB_PORT);
// ----------------------------------

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};