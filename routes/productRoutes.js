const express = require('express');
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/verifyToken');  // <-- import

const router = express.Router();

router.post('/add-product/:firmId', verifyToken, productController.addProduct); // <-- protect here
router.get('/:firmId/products', productController.getProductByFirm);

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

router.delete('/:productId', verifyToken, productController.deleteProductById); // Optional: protect delete too

module.exports = router;
