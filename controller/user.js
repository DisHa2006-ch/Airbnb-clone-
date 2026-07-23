const User = require("../models/user");

module.exports.getSignup =(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.postSignup = async (req,res)=>{
    try {
        let {username , email, password} = req.body;
        const newUser = new User ({email , username})
        const registeruser = await User.register(newUser , password)
        console.log(registeruser)
        req.login(registeruser , (err)=>{
               if(err){
                return next(err)
               }
               req.flash("success" , "Welcome To Travellers!")
               res.redirect("/listing" )
        })
       
    } catch (e) {
        req.flash("error" , e.message)
        res.redirect("/signup")
    }
  
}

module.exports.getLogin =(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.postLogin = async (req,res)=>{
    req.flash("success" ,"welcome back to  Travellers")
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect( redirectUrl)
}


module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
          return  next(err)
        }
        req.flash("success" , "You are logged out")
        res.redirect("/listing")
    })
}