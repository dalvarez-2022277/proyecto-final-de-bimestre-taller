import Cart from '../cart/cart.model.js';

export const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    
    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }
        
        const existingProductIndex = cart.products.findIndex(item => item.product == productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
