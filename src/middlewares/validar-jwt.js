import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';
import Cart from '../cart/cart.model.js';

export const validarJWT = async (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la solicitud",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(decoded.uid);

    console.log('Usuario en validarJWT:', user);

    if (!user) {
      return res.status(401).json({
        msg: 'El usuario no existe en la base de datos',
      });
    }

    // Verificar si el usuario ha cambiado desde la última solicitud
    if (req.user && req.user._id.toString() !== user._id.toString()) {
      // Si el usuario ha cambiado, borrar el carrito del usuario anterior
      await Cart.findOneAndDelete({ userId: req.user._id });
    }

    // Asignar el usuario actual a req.user
    req.user = user;

    next();

  } catch (error) {
    console.error('Error al verificar el token JWT:', error);
    return res.status(401).json({
      msg: "Token JWT no válido",
    });
  }
}
