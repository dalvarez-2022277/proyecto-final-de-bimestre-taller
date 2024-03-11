import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { productPost, updateProduct, getProductStockAndSalesStatus, deleteProduct } from "./product.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
const routerProducts = Router();

routerProducts.post(
    '/',
    [
        validarCampos,
        validarJWT
    ],
    productPost
);

routerProducts.put(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    updateProduct
);

routerProducts.get(
    '/',
    [
        validarCampos
    ],
    getProductStockAndSalesStatus
);

routerProducts.delete(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    deleteProduct
);


export default routerProducts;