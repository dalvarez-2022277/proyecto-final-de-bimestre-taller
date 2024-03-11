import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        stockProduc: {
            type: Number,
            required: true
        }
    }],
    totalPagar: {
        type: Number,
        default: 0
    }
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
