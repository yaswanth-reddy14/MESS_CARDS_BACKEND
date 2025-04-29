const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv'); 

dotEnv.config();
const secretkey = process.env.WhatIsYourName;

const vendorRegister = async(req, res) => {
        const {username,email,password} = req.body;
    try{
        const vendorEmail = await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json("Email already exists");
        }
        const hashPassword = await bcrypt.hash(password,10);

        const newVendor = new Vendor({
            username,
            email,
            password:hashPassword,
            
        }); 
        await newVendor.save();

        res.status(201).json({message : "vendor regestered succesfully"});
        console.log('registered')
          
    }catch(error){
        console.error(error);
        res.status(500).json({error : "internal server error"})
    

    }
     
}

const vendorLogin = async(req, res) => {
    const {email,password} = req.body;
    try{
        const vendor = await Vendor.findOne({email});
        if(!vendor ||!(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error : "Invalid credentials"})
    }
    const token = jwt.sign({vendorId : vendor._id }, secretkey)


    res.status(200).json({success: "Login Success",token})
    console.log(email,"this is token", token);
    }catch(error){
        console.error(error);
        res.status(500).json({error : "internal server error"})
    
    }
}

const getAllVendors = async(req, res) => {
    try{
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors})
    }catch(error){
        console.error(error);
        res.status(500).json({error : "Internal server error"});
    }
}

const getVendorById = async(req, res) => {
        const vendorId = req.params.id;

        try {
            const vendor = await vendor.findById(vendorId).populate('firm');
            if (!vendor) {
                return res.status(404).json({ error: "Vendor not found" });
            }
            res.status(200).json({vendor})
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error " });
            
        }


}
module.exports = {vendorRegister,vendorLogin,getAllVendors, getVendorById }