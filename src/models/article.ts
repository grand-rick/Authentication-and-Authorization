import client from '../database';

export type Article = {
    id?: string | number;
    title: string
    content: string
}

export default class ArticleStore {
    async index(): Promise<Article[]> {
        try {
            const sql = 'SELECT * FROM articles';

            const conn = await client.connect();
            const result = await conn.query(sql);

            conn.release();

            return result.rows;
        } catch (error) {
            throw new Error(`Couldn't open article. Error: ${error}`);
        }
    }

    async create(a: Article): Promise<Article> {
        try {
            const sql = 'INSERT INTO articles (title, content) VALUES (($1), ($2)) RETURNING *';
            const conn = await client.connect();
            const result = await conn.query(sql, [a.title, a.content]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Couldn't create new article. Error: ${error}`);
        }
    }

    async show(id: string): Promise<Article> {
        try {
            const sql = 'SELECT * FROM articles WHERE id = ($1)';

            const conn = await client.connect();
            const result = await conn.query(sql, [id]);

            return result.rows[0];
        } catch (error) {
            throw new Error(`Couldn't show article. Error: ${error}`);
        }
    }

    async update(a: Article): Promise<Article> {
        try {
            const sql = 'UPDATE articles SET title = $2, content = $3 WHERE id = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [a.id, a.title, a.content]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Couldn't update article. Error: ${error}`);
        }
    }

    async delete(id: string): Promise<Article> {
        try {
            const sql = 'DELETE FROM articles WHERE id = ($1)';

            const conn = await client.connect();
            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0];
        } catch (error) {
            throw new Error(`Couldn't delete article. Error: ${error}`);
        }
    }
}