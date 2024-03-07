import express from 'express';
import { check } from 'express-validator';
import { addToCart } from '../cart/cart.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = express.Router();

router.post('/', [
    check('userId', 'User ID is required').notEmpty(),
    check('productId', 'Product ID is required').notEmpty(),
    check('quantity', 'Quantity must be a positive integer').isInt({ min: 1 }),
    validarCampos
], addToCart);

export default router;
