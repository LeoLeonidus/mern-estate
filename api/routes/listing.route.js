import express from 'express';
import {createListing, test} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/test' , test);
router.post('/createListing' , verifyToken , createListing);
//router.post('/createListing' ,  createListing);

export default router;