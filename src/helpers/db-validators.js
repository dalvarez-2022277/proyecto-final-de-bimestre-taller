import User from '../users/user.model.js'; 
import Product from '../products/product.model.js';

export const existeEmail = async (email = '') => {
    const emailmin = email.toLowerCase();
    const existeEmail = await User.findOne({ 
        email: {
            $regex: new RegExp(`^${emailmin}$`, 'i')
        }
    });

    if (existeEmail) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
};

export const existeProductoById = async (productId) => {
    const producto = await Product.findById(productId);
    if (!producto) {
        throw new Error(`El producto con el ID ${productId} no existe`);
    }
};