import Cart from '../cart/cart.model.js';
import Product from '../products/product.model.js';

export const addToCart = async (req, res) => {
  console.log('Usuario:', req.user);
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
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
    cart = await Cart.populate(cart, { path: 'products.product' });

    let totalPagar = 0;
    for (const item of cart.products) {
      const productPrice = item.product.price;
      const quantityInCart = item.stockProduc;
      if (isNaN(productPrice) || isNaN(quantityInCart)) {
        return res.status(500).json({ message: 'Error interno del servidor: Precio del producto o cantidad en el carrito no es un número válido' });
      }
      totalPagar += productPrice * quantityInCart;
    }
    
    cart.totalPagar = totalPagar;
    await cart.save();

    const responseData = {
      _id: cart._id,
      userId: cart.userId,
      products: cart.products.map(item => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          category: item.product.category
        },
        quantityCarr: item.stockProduc
      })),
      totalPagar: totalPagar
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
