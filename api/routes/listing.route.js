import express from 'express';
import {createListing, deleteListing , updateListing ,invalidListingRoute ,  test} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/test' , test);
router.post('/createListing' , verifyToken , createListing);
router.delete('/delete/:id' , verifyToken , deleteListing);
router.post('/update/:id' , verifyToken ,  updateListing);

router.all('*' , invalidListingRoute);

export default router;