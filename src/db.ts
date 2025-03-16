import  pkg  from "pg";
import dotenv from 'dotenv';
const { Pool } = pkg

dotenv.config();

export const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});