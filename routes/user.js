const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware")
const userController = require("../controller/user.js")

//signup
router.route("/signup")
.get( userController.getSignup)
.post( wrapAsync (userController.postSignup))

//login
router.route("/login")
.get(userController.getLogin  )
.post(saveRedirectUrl, passport.authenticate("local" ,{failureRedirect:'/login' , failureFlash: true}) , wrapAsync (userController.postLogin))

//logout
router.get("/logout" , userController.logOut)

module.exports = router;