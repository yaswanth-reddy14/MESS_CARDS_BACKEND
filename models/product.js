const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_Name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    category: {
        type: [{
            type: String,
            enum: ['veg', 'non-veg']
        }]
    },
    bestseller: {
        type: String
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner'], // Added mealType
        required: true
    },
    firm: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm'
    }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
