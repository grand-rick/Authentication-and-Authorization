import ProductStore, {Product} from "../models/product";
import express, {Request, Response} from 'express';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
    try {
        const products = await store.index();
        res.json(products);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    const product1 = {
        name: req.body.name,
        price: req.body.price
    }
    try {
        const newProduct = await store.create(product1);
        res.json(newProduct);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const product = await store.show(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await store.delete(req.params.id);
        res.json(deleted);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const productsRoutes = (app: express.Application) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.get('/products/:id', destroy);
    app.post('/products', create);
};

export default productsRoutes;
