import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async (req,res,next) => {

    console.log("req.body=",req.body);

    const {username,email,password} = req.body;
    if ( !username || !email || !password) {
        //res.status(500).json("Invalid data");
        next (errorHandler(500,'Invalid data'));
        
        return;
    }
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User( {username,email,password: hashedPassword} );

    try {
        await newUser.save();
        res.status(201).json("User created successfully");
    } catch (error) {
        next(error);
    }
    
};