import client from '../database';

export type Product = {
    id?: string | number;
    name: string;
    price: string;
}

export default class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const sql = 'SELECT * FROM products';
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Unable to show all products. Error: ${err}`);
        }
    }

    async create(p: Product): Promise<Product> {
        try {
            const sql = 'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *';
            const conn = await client.connect();
            const result = await conn.query(sql, [p.name, p.price]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to create new product. Error: ${err}`);
        }
    }

    async update(p: Product): Promise<Product> {
        try {
            const sql = 'UPDATE products SET name = $2, price = $3 WHERE id = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [p.id, p.name, p.price]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to update product. Error: ${err}`);
        }
    }

    async show(id: string): Promise<Product> {
        try {
            const sql = 'SELECT * FROM products WHERE id = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to show product. Error: ${err}`);
        }
    }

    async delete(id: string): Promise<Product> {
        try {
            const sql = 'DELETE FROM products WHERE id = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to show delete product. Error: ${err}`);
        }
    }
}