import user from '../user/user.model.js';
import Product from '../products/product.model.js';

export const existeEmail = async (email = '') => {
    const emailmin = email.toLowerCase();
    const existeEmail = await user.findOne({
        email: {
            $regex: new RegExp(`^${emailmin}$`, 'i')
        }
    });

    if (existeEmail) {
        throw new Error(`El correo ${email} ya esta registrado`);
    }
};

export const existeProducto = async (productId) => {
    const producto = await Product.findById(productId);

    if (!producto) {
        throw new Error(`El producto con ID ${productId} no existe`);
    }
};