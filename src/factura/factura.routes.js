import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { generarFactura,obtenerFacturasUsuario,obtenerDetalleFactura,editarFactura,obtenerHistorialCompras}from "./factura.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
const facturaRoutes = Router();

facturaRoutes.get(
    '/',
    [
        validarJWT
    ],
    generarFactura
);

facturaRoutes.put(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    editarFactura
);

facturaRoutes.get(
    '/:userId',
    [
        validarJWT,
        validarCampos
    ],obtenerFacturasUsuario
);

facturaRoutes.get(
    '/detalle/:facturaId',
    [
        validarJWT,
        validarCampos
    ],obtenerDetalleFactura
);

facturaRoutes.get(
    '/historial/:userId',
    [
        validarJWT,
        validarCampos
    ],obtenerHistorialCompras
);

export default facturaRoutes;