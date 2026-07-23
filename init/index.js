

const mongoose = require('mongoose');
 const initData = require("./data.js");
 const Listing = require("../models/listing.js");

 const mongo_url ="mongodb+srv://khushi_216:5A4e9iQg12uYuBBX@cluster0.q6nnt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
 

 main().then( ()=>{
    console.log("connected to dbs")
 }).catch(err =>{
    console.log(err)
 })
 async function main() {
    await mongoose.connect(mongo_url)
  
 }

 const initDB = async ()=>{
    await Listing.deleteMany({});

    console.log("data was init")
 }

 initDB();