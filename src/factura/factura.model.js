import mongoose from "mongoose";
const { Schema } = mongoose;

const FacturaSchema = new Schema({
    comprador: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productos: [{
        producto: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        },
        precioUnitario: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Factura", FacturaSchema);
