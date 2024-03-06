import Cart from '../model/cart.model.js';
import Product from '../models/Product.js';
import user from '../model/user.model.js';

// Controlador para agregar un producto al carrito
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Suponiendo que ya tienes el usuario autenticado

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [{ product: productId, quantity }] });
        } else {
            const existingItem = cart.items.find(item => item.product.equals(productId));
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controlador para obtener el carrito de un usuario
export const getCart = async (req, res) => {
    const userId = req.user.id; // Suponiendo que ya tienes el usuario autenticado

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
