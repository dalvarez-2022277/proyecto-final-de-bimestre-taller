import categoryModel from "../categorias/category.model.js";

export const existeCategoryByName = async (nameCategory = '') => {
    const tituloMin = nameCategory.toLowerCase();

    const existeTittle = await categoryModel.findOne({
        nameCategory: {
            $regex: new RegExp(`^${tituloMin}$`, 'i')
        }
    });

    if (existeTittle) {
        throw new Error(`el titulo ${nameCategory} ya existe`);
    }
}