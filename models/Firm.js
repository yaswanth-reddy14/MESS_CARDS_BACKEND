const mongoose = require('mongoose');
const Product = require('./product');

const firmSchema = new mongoose.Schema({
    messName: {   // changed from mess_Name to messName
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: String,
        required: true
    },
    address: git {  // changed from mess_Address to address
        type: String,
        required: true
    },
    contact: {  // added new field contact
        type: String,
        required: true
    },
    image: {
        type: String
    },
    vendor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
        }
    ],
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

const Firm = mongoose.model('Firm', firmSchema);

module.exports = Firm;
