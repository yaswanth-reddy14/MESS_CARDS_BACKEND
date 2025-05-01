const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

// Setup multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Add or update a firm
const addOrUpdateFirm = async (req, res) => {
    try {
        const { messName, area, address, contact } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        // Check if a firm with the same mess name exists
        let firm = await Firm.findOne({ mess_Name: messName });

        if (firm) {
            // Update existing firm
            firm.area = area || firm.area;
            firm.mess_Address = address || firm.mess_Address;
            firm.contact = contact || firm.contact;
            if (image) firm.image = image;

            if (!firm.vendor.includes(vendor._id)) {
                firm.vendor.push(vendor._id);
            }

            await firm.save();
            return res.status(200).json({
                message: "Firm updated successfully",
                firmId: firm._id
            });
        } else {
            // Create a new firm
            const newFirm = new Firm({
                mess_Name: messName,
                area,
                mess_Address: address,
                contact,
                image,
                vendor: [vendor._id]
            });

            const savedFirm = await newFirm.save();

            // Link firm to vendor
            vendor.firm.push(savedFirm._id);
            await vendor.save();

            return res.status(201).json({
                message: "Firm added successfully",
                firmId: savedFirm._id
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all firms added by a vendor
const getFirmsByVendor = async (req, res) => {
    try {
        const vendorId = req.vendorId; // comes from verifyToken middleware
        const firms = await Firm.find({ vendor: vendorId });
        res.status(200).json(firms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not fetch firms" });
    }
};

// Delete firm by ID
const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const deletedFirm = await Firm.findByIdAndDelete(firmId);

        if (!deletedFirm) {
            return res.status(404).json({ error: "Firm not found" });
        }

        return res.status(200).json({ message: "Firm deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    addFirm: [upload.single('image'), addOrUpdateFirm],
    getFirmsByVendor,
    deleteFirmById
};
