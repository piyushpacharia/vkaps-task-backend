import Joi from "joi";
import bcrypt from 'bcrypt'
import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const signUp = async (req, res) => {
    const inputSanitizer = Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        password: Joi.string().pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required(),
    });

    const { error } = inputSanitizer.validate(req.body);
    if (error) {
        return res.json({ success: false, message: error.details[0].message });
    }

    const { email, name, password } = req.body;

    try {
        const admin = await userModel.findOne({ email: email });
        if (admin) {
            return res
                .status(409)
                .json({ success: false, message: "Admin Already Registered" });
        }


        const hashPassword = bcrypt.hashSync(password, 10);
        await userModel.create({
            name: name,
            email: email,
            role: "admin",
            password: hashPassword
        });

        return res.status(200).json({
            success: true,
            message: "Registration successful",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong: " + err.message,
        });
    }
};
export const signIn = async (req, res) => {
    const inputSanitizer = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error } = inputSanitizer.validate(req.body);
    if (error) {
        return res.json({ success: false, message: error.details[0].message });
    }
    const { email, password } = req.body;
    let user = await userModel.findOne({ email: email });

  
    if (!user) {
      return res.status(401).json({ success: false, message: "Email Not Found" });
    }  
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const token = jwt.sign(
          {
            _id: user._id, 
            role: user.role, 
          },
          process.env.JWT_SECRET
        );
        return res.status(200).json({
          success: true,
          message: "LoggedIn Successfully",
          token: token,
          role: user.role
  
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect Password" });
      }
    });
  };