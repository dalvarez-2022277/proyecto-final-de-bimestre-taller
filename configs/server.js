"use strict";

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import UserRoutes from '../src/model/user.routes.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.UserRoutes = '/Ventas_Online/v1/user';
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
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port', this.port);
        });
    }
}

export default Server;