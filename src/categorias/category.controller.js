import { response, request } from "express";
import Category from './category.model.js';
import User from "../users/user.model.js";
import Product from "../products/product.model.js";

export const categoryPost = async (req, res) => {
    const { nameCategory, descriptionCategory } = req.body;
    const userRole = req.user.role;
    if (userRole !== 'ADMIN') {
        return res.status(400).json({
            msg: 'No tienes permiso para realizar esta operación porque no eres administrador.'
        });
    }

    try {
        const newCategory = new Category({ nameCategory, descriptionCategory });
        await newCategory.save();

        res.status(200).json({
            category: newCategory
        });
    } catch (error) {
        console.error("Error al crear una nueva categoría:", error);
        res.status(500).json({
            error: 'Hubo un error al crear la categoría.'
        });
    }
};


export const categoryPut = async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== 'ADMIN') {
        return res.status(400).json({
            msg: 'No tienes permiso para realizar esta operación porque no eres administrador.'
        });
    }

    const { _id, ...resto } = req.body;

    try {
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        await Category.findByIdAndUpdate(id, resto);

        const updatedCategory = await Category.findById(id);

        res.status(200).json({
            msg: 'Categoría actualizada exitosamente',
            category: updatedCategory
        });
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        res.status(400).json({ error: error.message });
    }
};



export const categoryDelete = async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;

    try {
        if (userRole !== 'ADMIN') {
            return res.status(400).json({
                msg: 'No tienes permiso para realizar esta operación porque no eres administrador.'
            });
        }

        const categoryToDelete = await Category.findById(id);
        if (!categoryToDelete) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const productsToUpdate = await Product.find({ category: id });

        const nuevaCategoria = await Category.findOne({ categoryState: true });
        if (!nuevaCategoria) {
            return res.status(404).json({ error: 'No hay categorías disponibles para transferir los productos.' });
        }

        await Product.updateMany({ category: id }, { $set: { category: nuevaCategoria._id } });

        await Category.findByIdAndUpdate(id, { categoryState: false });

        res.status(200).json({
            msg: 'Categoría eliminada y productos transferidos exitosamente.'
        });
    } catch (error) {
        console.error("Error al eliminar la categoría y transferir productos:", error);
        res.status(500).json({
            error: 'Error al eliminar la categoría y transferir productos.'
        });
    }
};


export const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Category.find({});
        return res.status(200).json({
            msg: 'Categorías obtenidas correctamente',
            categorias
        });
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        return res.status(500).json({ msg: 'Hubo un error al obtener las categorías.' });
    }
};
