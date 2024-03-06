import { Router } from 'express';
import { Login } from './auth.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { check } from 'express-validator';

const routes = Router();

routes.post('/', [
    check('email', 'El correo no es valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], Login);

export default routes;