import client from '../database';

export type Order = {
    id?: string | number;
    status: string;
    user_id: string;
}

export default class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const sql = 'SELECT * FROM orders';
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Unable to show all orders. Error: ${err}`);
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const sql = 'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *';
            const conn = await client.connect();
            const result = await conn.query(sql, [o.status, o.user_id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to create new order. Error: ${err}`);
        }
    }

    async update(o: Order): Promise<Order> {
        try {
            const sql = 'UPDATE orders SET status = $2, user_id = $3 WHERE id = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [o.id, o.status, o.user_id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to update order. Error: ${err}`);
        }
    }

    async show(id: string): Promise<Order> {
        try {
            const sql = 'SELECT * FROM orders WHERE id = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to show order. Error: ${err}`);
        }
    }

    async delete(id: string): Promise<Order> {
        try {
            const sql = 'DELETE FROM orders WHERE id = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to delete order. Error: ${err}`);
        }
    }

   async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {
    try {
        const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
        const conn = await client.connect();
        const result = await conn.query(sql, [quantity, orderId, productId]);
        conn.release();

        const order = result.rows[0];

        return order;
    } catch (err) {
        throw new Error(`Could not add product ${productId} to order${orderId}. Error: ${err}`);
    }
   }
}