import Listing from '../models/listing.model.js';
import { errorHandler } from "../utils/error.js";

export const test = (req,res) => {
    res.json({
        message: 'here is listing controller'
    });
};

export const createListing = async (req,res,next) => {

    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async (req,res,next) => {
    //console.log("req.params.id=",req.params.id);
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404,'Listing not found'));
        }
        
        if ( req.user.id != listing.userRef ) {
            return next(errorHandler(401,"You can only delete your listing"));
        }
    
        try {
            
            const listing = await Listing.findByIdAndDelete(req.params.id);
            console.log("deleteListing=",listing);

            return res.status(200).json(listing);
        } catch (error) {
            next (error);
        }  
    } catch (error) {
        next(error);
    }


}

export const getListing = async (req,res,next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404,'Listing not found'));
        }
        res.status(200).json(listing);
    } catch (error) {
        next (error);
    }
}

export const updateListing = async (req,res,next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404,'Listing not found'));
        }
        
        if ( req.user.id != listing.userRef ) {
            return next(errorHandler(401,"You can only update your listing"));
        }

        try {
            const updatedListing = await Listing.findByIdAndUpdate(req.params.id, 
                req.body,
                {new: true}
            );
            res.status(200).json(updatedListing);
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(error);
    }
}

export const invalidListingRoute = (req,res,next) => {
    return next(errorHandler(404,'Invalid Listing Route'));
}
