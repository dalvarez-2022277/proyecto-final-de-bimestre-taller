import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validar-campos.js'
import { usersPost, usersUpdate, eliminarUser } from '../users/user.controller.js';
import { verificarUser } from "../middlewares/users-validators.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeEmail } from "../helpers/db-validators.js";

const routerUsers = Router();

routerUsers.post(
    '/',
    [
        check("name", "this name is a parameter required").not().isEmpty(),
        check("email", "the parameter is required").custom(existeEmail).isEmail(),
        check("password", "the pass is required").isLength({ min: 6, }),
        verificarUser,
        validarCampos
    ],
    usersPost
);


routerUsers.put(
    '/:id',
    [
        validarJWT,
        check("password", "the pass is required").isLength({ min: 6, }),
    ],
    usersUpdate
);

routerUsers.delete(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    eliminarUser
);


export default routerUsers;