import Joi from "joi";
import { productModel } from "../models/product.model.js";

export const addProduct = async (req, res) => {
    const inputSanitizer = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        category: Joi.string().required(),
        inStock: Joi.number().required(),
        description: Joi.string().required(),
    });

    const { error } = inputSanitizer.validate(req.body);
    if (error) {
        return res.json({ success: false, message: error.details[0].message });
    }
    const { name, price, category, inStock, description } = req.body;
    const files = req.files;
    try {
        const produtData = await productModel.create({
            productImage: files && files.productImage ? files.productImage[0].filename : null,
            name: name,
            price: price,
            category: category,
            inStock: inStock,
            description: description
        })
        return res.status(200).json({ success: true, message: "Product Added Successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Error Adding Product" })
    }


}
export const updateProduct = async (req, res) => {
    const inputSanitizer = Joi.object({
        name: Joi.string().allow(""),
        price: Joi.number().allow(""),
        category: Joi.string().allow(""),
        inStock: Joi.number().allow(""),
        description: Joi.string().allow(""),
        productImage: Joi.string().allow(""),
    });

    const { error } = inputSanitizer.validate(req.body);
    if (error) {
        return res.json({ success: false, message: error.details[0].message });
    }
    const { name, price, category, inStock, description } = req.body;
    const productId = req.params.productId;
   
    const files = req.files
   
    try {
        const product = await productModel.findOne({ _id: productId })
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found" })
        }
        const produtData = await productModel.findOneAndUpdate({ _id: productId }, {
            $set: {
                name: name || product.name,
                price: price || product.price,
                category: category || product.category,
                inStock: inStock || product.inStock,
                description: description || product.description,
                productImage: files && files.productImage ? files.productImage[0].filename : product.productImage,
            }
        }, { new: true })
        return res.status(200).json({ success: true, message: "Product Updated Successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Error Updating Product" })
    }


}
export const fetchAllProducts = async (req, res) => {
    try {
        const products = await productModel.find()
        if (products.length <= 0) {
            return res.status(404).json({ success: false, message: "No Products" })
        }
        return res.status(200).json({ success: true, products })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Error Updating Product" })
    }


}
export const fetchProductById = async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await productModel.findById({ _id: productId })
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found" })
        }
        return res.status(200).json({ success: true, product })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Error Fetching Product" })
    }


}
export const deleteProduct = async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await productModel.findByIdAndDelete({ _id: productId })
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found" })
        }
        return res.status(200).json({ success: true, message: "Product Deleted Successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Error Updating Product" })
    }


}