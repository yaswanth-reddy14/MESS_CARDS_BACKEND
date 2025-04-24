const vendorcontroller = require('../controllers/vendorController');  
const express = require('express');
const router = express.Router(); 

router.post('/register', vendorcontroller.vendorRegister);
router.post('/login', vendorcontroller.vendorLogin);   
router.get('/all-vendors', vendorcontroller.getAllVendors); 
router.get('/single-vendor/:id', vendorcontroller.getVendorById); 
    
module.exports = router;
