import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { productPost } from "./product.controller.js";
const routerProducts = Router();

routerProducts.post(
    '/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('description', 'La descripcion es obligatoria').not().isEmpty(),
        check('price', 'El precio es obligatorio').not().isEmpty(),
        check('stockProduc', 'El stock es obligatorio y debe ser un numero').isNumeric(),
        validarCampos
    ],
    productPost
);


export default routerProducts;