const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path'); 

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
        const { messName, area, address, contact } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        
        let firm = await Firm.findOne({ messName });

        if (firm) {
            
            firm.area = area || firm.area;
            firm.address = address || firm.address;
            if (image) firm.image = image; 
            if (!firm.vendor.includes(vendor._id)) {
                firm.vendor.push(vendor._id); 
            }

            await firm.save();
            return res.status(200).json({ message: "Firm updated successfully" });

        } else {
            
            const newFirm = new Firm({
                messName,
                area,
                address,
                contact,
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
