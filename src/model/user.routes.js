import { Router } from 'express';
import { check } from 'express-validator';
import { registrarUser } from './user.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existeEmail } from '../helpers/db-validators.js';

const routes = Router();

routes.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom(existeEmail),
    validarCampos
], registrarUser);

export default routes;