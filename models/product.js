const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_Name: {
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
        type: String,
        enum: ['Veg', 'Non-Veg']

    },
    mealType: {
       type: String,
       enum: ['breakfast', 'lunch', 'dinner'], 
       required: true
    },
    firm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
        required: true
      }
      
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
