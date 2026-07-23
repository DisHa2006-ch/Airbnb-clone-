if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const session = require('express-session');
const MongoStore = require("connect-mongo")
const flash = require('connect-flash');

const mongo_url = "mongodb://127.0.0.1:27017/Travellers";
const dbUrl = process.env.ATLAS_URL

const method_override = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErr = require("./utils/ExpressErr.js");

// Routes require

const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

// Passport require
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");
const data = require('./init/data.js');

// Set or use
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(method_override("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected to DB");
    } catch (err) {
        console.log("Error connecting to DB:", err);
    }
    serverSelectionTimeoutMS: 30000 
}

main(); // Calling the function to connect to MongoDB




// Session options
const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Cookie expiration in 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // Corrected from macAge to maxAge
        httpOnly: true,
    }
};



// Sessions
app.use(session(sessionOptions));
app.use(flash());

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting global variables for templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes

app.use("/listing", listingsRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// Error handling
app.all("*", (req, res, next) => {
    next(new ExpressErr(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("./listing/error.ejs", { message });
});


// Start the server
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});3