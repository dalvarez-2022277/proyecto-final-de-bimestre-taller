import Cart from '../cart/cart.model.js';
import Product from '../products/product.model.js';
import {validarJWT} from '../middlewares/validar-jwt.js';

export const addToCart = async (req, res) => {
  console.log('Usuario:', req.user);
  const { userId } = req.user;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Si el carrito no existe, crear uno nuevo con el userId proporcionado por req.user
      cart = new Cart({ userId: req.user._id, products: [] });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (product.stockProduc < quantity) {
      return res.status(400).json({ message: 'No hay suficiente stock disponible' });
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.product == productId
    );

    if (existingProductIndex !== -1) {
      const totalQuantity = cart.products[existingProductIndex].stockProduc + quantity;
      if (totalQuantity > product.stockProduc) {
        return res.status(400).json({ message: 'La cantidad total en el carrito excede el stock disponible' });
      }
      cart.products[existingProductIndex].stockProduc += quantity;
    } else {
      if (quantity > product.stockProduc) {
        return res.status(400).json({ message: 'La cantidad proporcionada excede el stock disponible' });
      }
      cart.products.push({ product: productId, stockProduc: quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
