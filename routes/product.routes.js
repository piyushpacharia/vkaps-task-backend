import express from "express"; 
import { addProduct, deleteProduct, fetchAllProducts, fetchProductById, updateProduct } from "../controller/productController.js";
import { authorization } from "../middlewares/auth.js";
import { uploadFile } from "../middlewares/fileUploader.js";

const router = express.Router();

router.post("/add-product/:fileCategory",authorization,uploadFile, addProduct);
router.put("/update-product/:productId/:fileCategory",authorization,uploadFile, updateProduct);
router.get("/fetch-all-products", fetchAllProducts);
router.get("/fetch-product/:productId", fetchProductById);
router.delete("/delete-product/:productId",authorization, deleteProduct);


export default router; 