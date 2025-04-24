const mongoose = require('mongoose');
const Product = require('./product');

const firmSchema = new mongoose.Schema({
    firmName: {
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: String,
        required: true
    },
    category: {
        type: [String], // Changed from array of objects to an array of strings
        enum: ['veg', 'non-veg']
    },
    region: {
        type: [String], // Changed from array of objects to an array of strings
        enum: ['andhra Meals', 'Tamil Sappadu', 'North Indian Thali', 'Kerala Sadya']
    },
    offer: {
        type: String
    },
    image: {
        type: String
    },
    vendor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
            
        }],
        products: [{
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product'
            }]
});

const Firm = mongoose.model('Firm', firmSchema);

module.exports = Firm;
