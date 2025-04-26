const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');
const path = require('path'); // You forgot to import 'path'!

const router = express.Router();

// Route to add or update a firm
router.post('/add-firm', verifyToken, firmController.addFirm);

// Route to serve uploaded images
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.setHeader('Content-Type', 'image/jpeg'); // Corrected: should be setHeader, not headersSent
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

// Route to delete a firm by ID
router.delete('/:firmId', firmController.deleteFirmById);

module.exports = router;
