import mongoose from "mongoose";
import { Product } from "./products.model";

const orderItemSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true
    }
}, {timestamps: true});

export const OrderItem = mongoose.model("OrderItem", orderItemSchema);