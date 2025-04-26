const mongoose = require('mongoose');
const Product = require('./product');

const firmSchema = new mongoose.Schema({
    mess_Name: {
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: String,
        required: true
    },
    mess_Address :{
        type: String,
        required: true
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
