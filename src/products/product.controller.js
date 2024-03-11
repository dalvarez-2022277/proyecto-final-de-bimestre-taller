import Product from "./product.model.js";
import { request, response } from 'express';
import User from '../users/user.model.js';

export const productPost = async (req = request, res = response) => {
    const { name, description, price, stockProduc, category } = req.body;
    const userId = req.user._id;

    // Verificar si el usuario es administrador
    const user = await User.findById(userId);
    if (user.role !== 'ADMIN') {
        return res.status(403).json({
            msg: 'El usuario no tiene permisos para agregar productos'
        });
    }

    const product = new Product({ name, description, price, stockProduc, category });
    console.log(product);

    await product.save();

    return res.status(200).json({
        product
    });
}


export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== 'ADMIN') {
        return res.status(400).json({
            msg: 'No tienes permiso para realizar esta operación porque no eres administrador.'
        });
    }

    try {
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        const { _id, ...resto } = req.body;
        await Product.findByIdAndUpdate(id, resto);

        const updatedProduct = await Product.findById(id);

        res.status(200).json({
            msg: 'Producto actualizado exitosamente',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(400).json({ error: error.message });
    }
};



export const getProductStockAndSalesStatus = async (req, res) => {
    try {
        const allProducts = await Product.find();

        allProducts.sort((a, b) => b.stockProduc - a.stockProduc);

        const productsWithStockAndSalesStatus = allProducts.map(product => {
            let agotadoProduct = '';
            switch (true) {
                case product.stockProduc === 0:
                    agotadoProduct = 'Agotado';
                    break;
                case product.stockProduc > 0 && product.stockProduc <= 10:
                    agotadoProduct = 'Stock bajo';
                    break;
                default:
                    agotadoProduct = 'Disponible';
            }
            const isMostSold = allProducts.indexOf(product) < 10; 

            return {
                _id: product._id,
                name: product.name,
                stockProduc: product.stockProduc,
                agotadoProduct: agotadoProduct, 
                mostSold: isMostSold 
            };
        });

        res.status(200).json({
            msg: 'Estado del stock y productos más vendidos obtenidos exitosamente',
            products: productsWithStockAndSalesStatus
        });
    } catch (error) {
        console.error('Error al obtener el estado del stock y productos más vendidos:', error);
        res.status(400).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== "ADMIN") {
        return res.status(400).json({
            msg: "No tienes permiso para eliminar productos."
        });
    }

    try {
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(400).json({
                msg: "El producto no fue encontrado."
            });
        }
        await Product.findByIdAndUpdate(id, { stateProduct: false });
        const deletedProduct = await Product.findById(id);
        res.status(200).json({
            msg: "Producto eliminado exitosamente",
            deletedProduct
        });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({
            error: "Hubo un error al eliminar el producto."
        });
    }
};
