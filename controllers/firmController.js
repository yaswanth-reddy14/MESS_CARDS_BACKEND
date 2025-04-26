const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path'); // Don't forget to import path

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const addOrUpdateFirm = async (req, res) => {
    try {
        const { mess_Name, area, mess_Address, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        // Check if a firm with same mess_Name already exists
        let firm = await Firm.findOne({ mess_Name });

        if (firm) {
            // Firm exists -> Update it
            firm.area = area || firm.area;
            firm.mess_Address = mess_Address || firm.mess_Address;
            firm.offer = offer || firm.offer;
            if (image) firm.image = image; // Update only if new image uploaded
            if (!firm.vendor.includes(vendor._id)) {
                firm.vendor.push(vendor._id); // Add vendor if not already linked
            }

            await firm.save();
            return res.status(200).json({ message: "Firm updated successfully" });

        } else {
            // Firm does not exist -> Create new
            const newFirm = new Firm({
                mess_Name,
                area,
                mess_Address,
                offer,
                image,
                vendor: vendor._id
            });

            await newFirm.save();
            return res.status(201).json({ message: "Firm added successfully" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

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
