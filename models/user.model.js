import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, default: 0 },
    password: { type: String },
    role: { type: String, enum: ["admin", "client"] },
}, {
    timestamps: true
})

export const userModel = mongoose.model("vkapsUsers", productSchema)