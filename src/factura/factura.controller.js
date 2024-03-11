import Cart from '../cart/cart.model.js';
import Product from '../products/product.model.js';
import Factura from '../factura/factura.model.js';
import User from '../users/user.model.js'; 

export const generarFactura = async (req, res) => {
    console.log('Usuario:', req.user);
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'No hay carrito activo con productos para este usuario' });
        }

        let totalPagar = 0;
        const productosFactura = [];
        for (const item of cart.products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            const subtotal = item.stockProduc * product.price;
            totalPagar += subtotal;

            productosFactura.push({
                producto: product._id,
                cantidad: item.stockProduc,
                precioUnitario: product.price,
                subtotal: subtotal
            });
        }
        
        const factura = new Factura({
            comprador: userId,
            productos: productosFactura,
            total: totalPagar
        });

        for (const item of cart.products) {
            const product = await Product.findById(item.product);
            if (!product) {
                continue;
            }

            if (product.stockProduc < item.stockProduc) {
                return res.status(400).json({ message: 'No hay suficiente stock disponible para completar la compra' });
            }

            product.stockProduc -= item.stockProduc;
            await product.save();
        }

        await factura.save();

        cart.products = [];
        await cart.save();

        res.status(200).json({
            message: 'Factura generada exitosamente y compra completada',
            factura
        });
    } catch (error) {
        console.error('Error al generar la factura y completar la compra:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const obtenerFacturasUsuario = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Acceso no autorizado. Se requieren permisos de administrador.' });
        }

        const { userId } = req.params;

        const usuario = await User.findById(userId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const facturas = await Factura.find({ comprador: userId });

        res.status(200).json({ facturas });
    } catch (error) {
        console.error('Error al obtener las facturas del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const obtenerDetalleFactura = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Acceso no autorizado. Se requieren permisos de administrador.' });
        }

        const { facturaId } = req.params;

        const factura = await Factura.findById(facturaId);
        if (!factura) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        const productos = await Promise.all(factura.productos.map(async (producto) => {
            const detalleProducto = await Product.findById(producto.producto);
            return { ...producto.toObject(), detalleProducto };
        }));

        res.status(200).json({ factura, productos });
    } catch (error) {
        console.error('Error al obtener el detalle de la factura:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const editarFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const { productos } = req.body;

        const user = await User.findById(req.user._id);
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Acceso no autorizado. Se requieren permisos de administrador.' });
        }

        const facturaExistente = await Factura.findById(id);
        if (!facturaExistente) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }

        for (const item of productos) {
            const producto = await Product.findById(item.producto);
            if (!producto) {
                return res.status(400).json({ message: `El producto con ID ${item.producto} no existe` });
            }
            if (item.cantidad > producto.stockProduc) {
                return res.status(400).json({ message: `La cantidad de ${producto.name} supera el stock disponible` });
            }

            const cantidadAnterior = facturaExistente.productos.find(prod => prod.producto.equals(item.producto))?.cantidad || 0;
            const diferencia = item.cantidad - cantidadAnterior;

            producto.stockProduc -= diferencia;
            await producto.save();
        }

        facturaExistente.productos = productos.map(item => ({
            producto: item.producto,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.precioUnitario * item.cantidad
        }));
        facturaExistente.total = facturaExistente.productos.reduce((total, item) => total + item.subtotal, 0);
        
        await facturaExistente.save();

        res.status(200).json({ message: 'Factura actualizada correctamente', factura: facturaExistente });
    } catch (error) {
        console.error('Error al editar la factura:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const obtenerHistorialCompras = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || user.role !== 'CLIENT') {
        }
        const { userId } = req.params;

        const usuario = await User.findById(userId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const facturas = await Factura.find({ comprador: userId });

        res.status(200).json({ facturas });
    } catch (error) {
        console.error('Error al obtener las facturas del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};