const reviews = require("../models/review");
const Listing = require('../models/listing');

module.exports.newReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new reviews(req.body.review)
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success" , " New Review Created")
    res.redirect(`/listing/${listing._id}`);
 
 }


 module.exports.destoryReview = async(req,res)=>{
    let {id ,reviewId} = req.params;
  
  await Listing.findByIdAndUpdate(id , {$pull : {reviews:reviewId}})
   await reviews.findByIdAndDelete(reviewId);
   req.flash("success" , " Review Deleted")
    res.redirect(`/listing/${id}`)
}