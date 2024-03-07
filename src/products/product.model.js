import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "The name is a required parameter"],
    },
    description: {
        type: String,
        required: [true, "The description is a required parameter"],
    },
    price: {
        type: Number,
        required: [true, "The price is a required parameter"],
    },
    stockProduc: {
        type: Number,
        required: [true, "the stock is a required parameter"],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    stateProduct: {
        type: Boolean,
        default: true,
    }
});

ProductSchema.methods.toJSON = function () {
    const { __v, _id, ...products } = this.toObject();
    products.uid = _id;
    return products;
}

export default mongoose.model('Product', ProductSchema);