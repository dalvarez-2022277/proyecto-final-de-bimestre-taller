import { Router } from "express";
import { categoryPost, categoryPut, categoryDelete,obtenerCategorias } from "./category.controller.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const routerCateg = Router();

routerCateg.post(
    '/',
    [
        validarJWT,
        validarCampos
    ],
    categoryPost
);

routerCateg.put(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    categoryPut
);

routerCateg.delete(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    categoryDelete
);

routerCateg.get(
    '/categorias',
    [
        validarJWT,
        validarCampos
    ],
    obtenerCategorias
);

export default routerCateg;