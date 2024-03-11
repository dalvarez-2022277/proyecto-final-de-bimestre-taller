import express from 'express';
import { check } from 'express-validator';
import { createOrder } from '../cart/order.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = express.Router();

router.post('/', [
    check('userId', 'User ID is required').notEmpty(),
    check('products', 'Products are required').isArray({ min: 1 }),
    check('total', 'Total must be a positive number').isNumeric({ min: 0 }),
    validarCampos
], createOrder);

export default router;
