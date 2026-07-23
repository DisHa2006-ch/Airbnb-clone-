const Listing = require('./models/listing');
const ExpressErr = require("./utils/ExpressErr.js")
const {listingSchema ,reviewSchema} = require('./schema.js')
const reviews = require("./models/review.js");

module.exports.isLoggedIn = (req, res , next)=>{

    if( !req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        console.log(req.session.redirectUrl)
        req.flash("error" ,"You must be login in to create listing");
     return  res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req, res , next)=>{
 if(req.session.redirectUrl ){
    res.locals.redirectUrl = req.session.redirectUrl 
    console.log(res.locals.redirectUrl);
 }
next()
}

module.exports.isOwner =async (req, res , next)=>{
    let {id} = req.params;
let listing = await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of the listing ")
    return res.redirect(`/listing/${id}`)
    }
next()
}

//validateListing
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) =>el.message).join(",")
        throw new ExpressErr(400 , errmsg)
       }else {
        next();
       }
    }

    //validateReview
    module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) =>el.message).join(",")
        throw new ExpressErr(400 , errmsg)
       }else {
        next();
       }
}

//isReviewAuthor
module.exports.isReviewAuthor =async (req, res , next)=>{
    let {id,reviewId} = req.params;
let review = await reviews.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of the review ")
    return res.redirect(`/listing/${id}`)
    }
next()
}
