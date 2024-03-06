import { response, request } from 'express';
import user from '../model/user.model.js';
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../helpers/generar-jwt.js';

export const Login = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
        let users = null;
        const validEmail = email.includes('@');
        if (validEmail) {

            if (email) {
                users = await user.findOne({ email });
            } else {
                return res.status(500).json({
                    msg: 'Debe proporcionar un correo valido'
                });
            }

            if (!users) {
                return res.status(400).json({
                    msg: 'Usuario o contraseña incorrectos'
                })
            }

            const validPassoword = await bcryptjs.compare(password, users.password);

            if (!validPassoword) {
                return res.status(400).json({
                    msg: 'Constraseña incorrecta'
                });
            }

            const token = await generarJWT(users.id);

            return res.status(200).json({
                msg: 'Bienvenido al sistema de ventas online!',
                users,
                token
            })

        }

        return res.status(400).json({
            msg: 'debes ingresar un correo valido:)'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error interno del servidor', error
        });
    }
}