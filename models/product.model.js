import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: { type: String },
    price: { type: Number, default: 0 },
    category: { type: String },
    inStock: { type: Number, default: 0 },
    productImage: { type: String },
    description: { type: String },
}, {
    timestamps: true
})

export const productModel = mongoose.model("products", productSchema)