import express, {Request, Response} from 'express';
import ArticleStore, {Article} from '../models/article';

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
      try {
        const newArticle: Article = await store.create({title: req.body.title, content: req.body.content});
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

const remove = async (req: Request, res: Response) => {
    try {
        const deleted: Article = await store.delete(req.params.id);
        res.json(deleted);
    } catch (err) {
       res.status(400);
       res.json(err);
    }
};


const articlesRoutes = (app: express.Application) => {
    app.get('/articles', index);
    app.get('/articles/:id', show);
    app.post('/articles', create);
    app.put('/articles:id', update);
    app.delete('/articles/:id', remove);
};

export default articlesRoutes;