import express from 'express';
import { check } from 'express-validator';
import { addToCart } from '../cart/cart.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existeProductoById } from '../helpers/db-validators.js';

const router = express.Router();

router.post('/', [
    check('productId', 'El producto no existe').custom(existeProductoById),
    check('productId', 'El id no es un id valido').isMongoId(),
    check('quantity', 'Quantity debe ser un numero positivo').isInt({ min: 1 }),
    validarCampos,
    validarJWT,
], addToCart);

export default router;
