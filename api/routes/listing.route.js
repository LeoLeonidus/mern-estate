import express from 'express';
import {createListing, deleteListing , updateListing ,invalidListingRoute ,  test, getListing} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/test' , test);
router.post('/createListing' , verifyToken , createListing);
router.delete('/delete/:id' , verifyToken , deleteListing);
router.post('/update/:id' , verifyToken ,  updateListing);
router.get('/get/:id' , getListing);

router.all('*' , invalidListingRoute);

export default router;