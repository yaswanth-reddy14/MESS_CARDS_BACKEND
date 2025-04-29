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

        if (firm)    {
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
                firmId: firm._id  // Sending firmId as part of the response
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
            const firmId = newFirm._id;
            vendor.firm.push(firmId)
            

            await newFirm.save();
            return res.status(201).json({
                message: "Firm added successfully",
                firmId: newFirm._id  // Sending firmId as part of the response
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
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
    deleteFirmById
};
