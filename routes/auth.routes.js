import express from "express";
import { signIn, signUp } from "../controller/authController.js";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);


export default router;