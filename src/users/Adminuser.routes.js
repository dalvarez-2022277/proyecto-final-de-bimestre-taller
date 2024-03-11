import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validar-campos.js'
import { actualizarUsuarioAdm, eliminarUsersAdm } from './user.controller.js';
import { validarJWT } from "../middlewares/validar-jwt.js";
const routesAdminuser = Router();

routesAdminuser.delete(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    eliminarUsersAdm
);

routesAdminuser.put(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    actualizarUsuarioAdm
);


export default routesAdminuser;