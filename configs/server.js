"use strict";

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import UserRoutes from '../src/users/user.routes.js';
import LoginRoutes from '../src/auth/auth.routes.js';
import ProductRoutes from '../src/products/product.routes.js';
import CartRoutes from '../src/cart/cart.routes.js';
import CategotyRoutes from '../src/categorias/category.routes.js';
import FacturaRoutes from '../src/factura/factura.routes.js';
import UserAdminRoutes from '../src/users/Adminuser.routes.js';
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.UserRoutes = '/Ventas_Online/v1/user';
        this.LoginRoutes = '/Ventas_Online/v1/login';
        this.ProductRoutes = '/Ventas_Online/v1/product';
        this.CartRoutes = '/Ventas_Online/v1/cart';
        this.CategotyRoutes = '/Ventas_Online/v1/category';
        this.FacturaRoutes = '/Ventas_Online/v1/factura';
        this.UserAdminRoutes = '/Ventas_Online/v1/adminuser';
        this.middlewares();
        this.ConectionDB();
        this.routes();
    }

    async ConectionDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.UserRoutes, UserRoutes);
        this.app.use(this.LoginRoutes, LoginRoutes);
        this.app.use(this.ProductRoutes, ProductRoutes)
        this.app.use(this.CartRoutes, CartRoutes);
        this.app.use(this.CategotyRoutes, CategotyRoutes);
        this.app.use(this.FacturaRoutes, FacturaRoutes);
        this.app.use(this.UserAdminRoutes, UserAdminRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }
}

export default Server;