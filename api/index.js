import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

//console.log("Connection String =",process.env.MONGO,"<---------");
mongoose.connect(process.env.MONGO).then( () => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen( 3000 , () => {
    console.log("Server is listening on port 3000 !!");
});

app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);

// Middleware for errors

app.use( (err,req,res,next) => {
    const statusCode = err.statusCode || 500 ;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

