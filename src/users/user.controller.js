import { response, request } from "express";
import Users from './user.model.js';
import { verificarUser } from '../middlewares/users-validators.js';
import bcryptjs from 'bcryptjs';

export const usersPost = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const user = new Users({ name, email, password, role });

        const encrip = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, encrip);

        await user.save();

        res.status(200).json({
            msg: 'Usuario agregado exitosamente',
            user
        });
    } catch (error) {
        console.error('Error al agregar el usuario: ', error);
        res.status(400).json({ error: error.message });
    }
};
export const usersUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, email, oldPassword, newPassword, role } = req.body;

    if (role) {
        return res.status(400).json({ msg: 'El rol no se puede modificar' });
    }

    try {
        const user = await Users.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if (oldPassword && user.password) {
            const isOldPasswordCorrect = await bcryptjs.compare(oldPassword, user.password);
            if (!isOldPasswordCorrect) {
                return res.status(400).json({ msg: 'Contraseña antigua incorrecta' });
            }
        } else {
            return res.status(400).json({ msg: 'Se requiere la contraseña antigua' });
        }

        user.name = name || user.name;
        user.email = email || user.email;

        if (newPassword) {
            const encrip = bcryptjs.genSaltSync();
            user.password = bcryptjs.hashSync(newPassword, encrip);
        }

        await user.save();

        res.status(200).json({
            msg: 'Usuario actualizado exitosamente',
            user
        });
    } catch (error) {
        console.error('Error al actualizar el usuario: ', error);
        res.status(400).json({ error: error.message });
    }
};

export const eliminarUser = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const usuarioValido = req.user; 
    const userToDelete = await Users.findById(id);

    // Verificar si el usuario logueado es el mismo que el usuario a eliminar
    if (usuarioValido._id.toString() !== id) {
        return res.status(403).json({ msg: 'No tienes permiso para eliminar este usuario.' });
    }

    if (!userToDelete) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, userToDelete.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    await Users.findByIdAndUpdate(id, { userState: false });

    res.status(200).json({
        msg: 'Usuario eliminado correctamente.',
        user: userToDelete
    });
}

export const eliminarUsersAdm = async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role; 
    if (userRole !== 'ADMIN') {
        return res.status(400).json({
            msg: 'No tienes permiso para realizar esta operación porque no eres administrador.'
        });
    }

    try {
        const userToDelete = await Users.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        await Users.findByIdAndUpdate(id, { userState: false });
        return res.status(200).json({
            msg: 'Usuario eliminado correctamente.',
            user: userToDelete
        });
    } catch (error) {
        console.error('Error al eliminar el usuario: ', error);
        return res.status(500).json({ error: error.message });
    }
};

export const actualizarUsuarioAdm = async (req, res) => {
    const { id } = req.params;
    const { password, newPassword, ...datosUsuario } = req.body;
    const usuarioValido = req.user;

    try {
        if (usuarioValido._id.toString() === id || usuarioValido.role === 'ADMIN') {
            const usuarioToUpdate = await Users.findById(id);
            if (!usuarioToUpdate) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }

            if (newPassword) {
                const salt = bcryptjs.genSaltSync();
                datosUsuario.password = bcryptjs.hashSync(newPassword, salt);
            }

            await Users.findByIdAndUpdate(id, datosUsuario, { new: true });

            const usuarioActualizado = await Users.findById(id).select('-password');

            return res.status(200).json({
                msg: 'Usuario actualizado correctamente.',
                usuario: usuarioActualizado
            });
        } else {
            return res.status(403).json({
                msg: 'No tienes permiso para actualizar este usuario.'
            });
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({ msg: 'Hubo un error al actualizar el usuario.' });
    }
};