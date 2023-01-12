import express, {Request, Response, NextFunction} from 'express';
import ArticleStore, {Article} from '../models/article';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET as unknown as string;

const store = new ArticleStore();

const index = async (_req: Request, res: Response) => {
    try {
        const articles = await store.index();
        res.json(articles);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const article = await store.show(req.params.id);
        res.json(article);
    } catch (error) {
        res.status(400);
        res.json(error);
    }
};

const create = async (req: Request, res: Response) => {
    const articleN = {
        title: req.body.title,
        content: req.body.content
    };

    try {
    const newArticle: Article = await store.create(articleN);
        res.json(newArticle);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const article: Article = await store.update({id: req.params.id, title: req.body.title, content: req.body.content});
        res.json(article);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    try {
        const deleted: Article = await store.delete(req.params.id);
        res.json(deleted);
    } catch (err) {
       res.status(400);
       res.json(err);
    }
};

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization as unknown as string;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, TOKEN_SECRET);
        next();
    } catch (error) {
        res.status(401);
        res.json(error);
    }
}

const articlesRoutes = (app: express.Application) => {
    app.get('/articles', index);
    app.get('/articles/:id', show);
    app.post('/articles', verifyAuthToken, create);
    app.put('/articles:id', verifyAuthToken, update);
    app.delete('/articles/:id', verifyAuthToken, destroy);
};

export default articlesRoutes;