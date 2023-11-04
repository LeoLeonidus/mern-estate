import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

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

export const signin = async (req,res,next) => {

    console.log("req.body=",req.body);

    const {email,password} = req.body;
    if ( !email || !password) {
        //res.status(500).json("Invalid data");
        next (errorHandler(500,'Invalid data'));
        
        return;
    }
    try {
        const validUser = await User.findOne({email});
        if (!validUser) {
            return next (errorHandler(404,'User Not Found'));
        }
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if (!validPassword){
            return next (errorHandler(401,'Invalid credentiels'));
        }
        const token = jwt.sign({ id: validUser._id} , process.env.JWT_SECRET);
        // eliminiamo la password dalla risposta:
        const { password: pass , ...rest } = validUser._doc;
        console.log("signin response=",rest,"<--------------------");
        res.cookie('access_token', token , {httpOnly: true}).status(200).json(rest);
        //res.status(200).json("User ok");
    } catch (error) {
        next (error);
    }
    
};

export const google = async (req,res,next) => {
    console.log("-----GOOGLE------");
    try {
        const user = await User.findOne({email:req.body.email});
        if (user){
            console.log("user in db");
            const token = jwt.sign({ id: user._id} , process.env.JWT_SECRET);
            const { password: pass , ...rest } = user._doc;
            res.cookie('access_token', token , {httpOnly: true}).status(200).json(rest);
        } else {
            console.log("user NOT in db");
            //because we have not a pw we generete a random one (16 digits):
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            console.log("generatedPw=",generatedPassword);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
            console.log("hashedPw=",hashedPassword);
            const newUser = new User( {
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            });
            console.log("newUser=",newUser);
            console.log("NEWUSER GENERATED");
            try {
                await newUser.save();
                const token = jwt.sign({ id: newUser._id} , process.env.JWT_SECRET);
                const { password: pass , ...rest } = newUser._doc;
                res.cookie('access_token', token , {httpOnly: true}).status(200).json(rest);
            } catch (error) {
                next(error);
            };
        }
    } catch (error) {
        next (error);
    };
}