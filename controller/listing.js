
const Listing = require('../models/listing');


module.exports.index = async (req,res)=>{
    const allListing =  await  Listing.find({})
    res.render("./listing/index.ejs", {allListing})
    }

    module.exports.new = (req,res)=>{
        
        res.render("./listing/new.ejs")
    }
    module.exports.show = async(req,res)=>{
        let {id} = req.params;
        const listing = await Listing.findById(id).populate({
            path: "reviews" ,
             populate: {path:"author",},})
        .populate("owner");
        
        if(!listing){
            req.flash("error" , " Listing Was Not Exit")
            return res.redirect("/listing")
        }
        
        res.render("./listing/show.ejs", {listing})
        }


        module.exports.create= async (req,res,next)=>{
            let url = req.file.path
            let filename = req.file.filename
            
            const newlisting  = new Listing(req.body.listing);
            newlisting.owner = req.user._id;
            newlisting.image = {url, filename}
            await newlisting.save();
           
            req.flash("success" , "New Listing Created")
            res.redirect("/listing")
        }
        module.exports.edit = async (req,res)=>{
            let {id} = req.params;
            const listing = await Listing.findById(id);
            if(!listing){
                req.flash("error" , " Listing Was Not Exit")
                return res.redirect("/listing")
            }
            let originalImageUrl = listing.image.url;
             originalImageUrl = originalImageUrl.replace("/upload" , "/upload/h_200,w_250")
            
            res.render("./listing/edit.ejs", {listing , originalImageUrl})
            }
           
            module.exports.update = async(req,res)=>{
                
                let {id} = req.params;
                let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

                if(typeof req.file !== "undefined"){
                    let url = req.file.path
                    let filename = req.file.filename
                    listing.image ={url, filename}
                    await listing.save();
                }
                
                req.flash("success" , " Listing Updated ")
                res.redirect(`/listing/${id}`)
                }

            module.exports.delete = async(req,res)=>{
                let {id} = req.params;
                let deletedListing =  await Listing.findByIdAndDelete(id);
                console.log(deletedListing)
                req.flash("success" , " Listing Deleted")
                res.redirect(`/listing`)
                }