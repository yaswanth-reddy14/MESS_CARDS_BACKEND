const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');
const path = require('path');

const router = express.Router();

// Add a new firm or update existing
router.post('/add-firm', verifyToken, firmController.addFirm);

// Get all firms added by a vendor
router.get('/my-firms', verifyToken, firmController.getFirmsByVendor);

// Serve uploaded firm images
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '..', 'uploads', imageName);

    res.sendFile(imagePath, err => {
        if (err) {
            res.status(404).json({ error: "Image not found" });
        }
    });
});

// Delete a firm by ID
router.delete('/:firmId', firmController.deleteFirmById);

module.exports = router;
