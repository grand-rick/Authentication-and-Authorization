import express, {Request, Response} from 'express';
import UserStore, {User} from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET = (process.env.TOKEN_SECRET as unknown) as string;

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    try {
        const users = await store.index();
        res.json(users);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const user = await store.show(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const create = async (req: Request, res: Response) => {
      try {
        const user1: User = {
            username: req.body.username,
            password: req.body.password
        };
        const newUser: User = await store.create(user1);
        var token = jwt.sign({user: newUser}, TOKEN_SECRET);
         res.json(token);
      } catch (err) {
         res.status(400);
         res.json(err);
      }
};

const update = async (req: Request, res: Response) => {
    try {
        const updatedUser: User = await store.update({id: req.params.id, username: req.body.username, password: req.body.password});
        res.json(updatedUser);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    try {
        const deleted: User = await store.delete(req.params.id);
        res.json(deleted);
    } catch (err) {
       res.status(400);
       res.json(err);
    }
};

const authenticate = async (req: Request, res: Response) => {
    try {
        const isAuthentic = await store.authenticate(req.body.username, req.body.password);
        res.json(isAuthentic);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}


const usersRoutes = (app: express.Application) => {
    app.get('/users', index);
    app.get('/users/:id', show);
    app.post('/users', create);
    app.put('/users:id', update);
    app.delete('/users/:id', destroy);
    app.get('/signup', authenticate);
};

export default usersRoutes;