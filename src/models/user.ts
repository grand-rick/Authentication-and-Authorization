import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import client from '../database';

dotenv.config();

const {
    BCRYPT_PASSWORD,
    SALT_ROUNDS
} = process.env;

const pepper: string = (BCRYPT_PASSWORD as unknown) as string;
const saltRounds: string = (SALT_ROUNDS as unknown) as string;

export type User = {
    id?: string | number;
    username: string;
    password: string;
}

export default class UserStore {
    async index(): Promise<User[]> {
        try {
            const sql = 'SELECT * FROM users';
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            const users = result.rows;
            return users;
        } catch (err) {
            throw new Error(`Couldn't display all users. Error: ${err}`);
        }
    }

    async create(u: User): Promise<User> {
        let user: User;
        try {
            const sql = 'INSERT INTO users (username, hash_password) VALUES($1, $2) RETURNING *';

            const hash = await bcrypt.hash(
            `${u.password}${pepper}`, 
            parseInt(saltRounds)
            );
            const conn = await client.connect();
            const userExists = await conn.query('SELECT * FROM users WHERE username = $1', [u.username]);

            if (userExists.rows.length) {
                user = userExists.rows[0];
            } else {
            const result = await conn.query(sql, [u.username, hash]);
            user = result.rows[0];
            }

            conn.release();

            return user
        } catch(err) {
                throw new Error(`unable create user (${u.username}): ${err}`)
            } 
        }

    async update(u: User): Promise<User> {
        try {
            const sql = 'UPDATE users SET username = ($4), hash_password = $6 WHERE id = ($1)';
            const hash = await bcrypt.hash(
                `${u.password}${pepper}`,
                parseInt(saltRounds)
            );
            const conn = await client.connect();
            const result = await conn.query(sql, [u.username, hash]);
            conn.release();
            const updatedUser = result.rows[0];
            return updatedUser;
        } catch (err) {
            throw new Error(`Couldn't update user. Error: ${err}`);
        }
    }

    async show(id: string): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE id = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            const user = result.rows[0];
            return user;
        } catch (err) {
            throw new Error(`Couldn't show user. Error: ${err}`);
        }
    }

    async delete(id: string): Promise<User> {
        try {
            const sql = 'DELETE FROM users WHERE id = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            const deleted = result.rows[0];
            return deleted;
        } catch (err) {
            throw new Error(`Couldn't delete user. Error: ${err}`);
        }
    }

    async authenticate(username: string, password: string): Promise<User | null> {
        try {
            const sql = 'SELECT * FROM users WHERE username = $1';
            const conn = await client.connect();
            const result = await conn.query(sql, [username]);
            conn.release();

            console.log(password + pepper);

            if (result.rows.length) {
                const user = result.rows[0];

                const isPasswordValid = await bcrypt.compare(`${password}${pepper}`, user.hash_password);

                if (isPasswordValid) {
                    return user;
                }
            } else {
                console.log(`Account doesn't exist. Please create one`);
            }

            return null;

        } catch (err) {
            throw new Error(`${err}`);
        }
    }
}