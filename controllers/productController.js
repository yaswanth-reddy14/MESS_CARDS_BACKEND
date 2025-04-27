const Product = require ("../models/product");
const multer = require ("multer");
const Firm = require( '../models/Firm');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname (file.originalname));
    }
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
    try {
        const { product_Name, description, price, category, bestseller, mealType } = req.body;
        const image = req.file ? req.file.filename : undefined;

        
        if (!['breakfast', 'lunch', 'dinner'].includes(mealType)) {
            return res.status(400).json({ error: "Invalid meal type. Must be 'breakfast', 'lunch', or 'dinner'" });
        }

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: "Firm not found" });
        } 

        const product = new Product({
            product_Name,
            price,
            category,
            bestseller,
            description,
            image,
            mealType,  
            firm: firm._id
        });

        const savedProduct = await product.save();
        
        firm.products.push(savedProduct);
        await firm.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getProductByFirm = async(req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({ error: "Firm not found" });
        }
        const restaurantName = firm.messName;  
        const products = await Product.find({ firm: firmId });

        res.status(200).json({ restaurantName, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteProductById = async(req, res) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm, deleteProductById };
