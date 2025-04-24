const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname (file.originalname));
    }
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
    try {
     const { firmName, area, category, region, offer } = req.body;
        
     const image = req.file ? req.file.filename : undefined;

     const vendor = await Vendor.findById(req.vendorId);
     if (!vendor) {
         res.status(404).json({ message: "Vendor not found" }) 
    }

    const firm = new Firm({  
        firmName, area, category, region, offer, image, vendor: vendor._id
    })
    await firm.save();

    return res.status(200).json({ message: 'Firm added successfully' })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "firm aleady exists" })
    }
}

const deleteFirmById = async (req, res) => {
    try {
            const firmId = req.params.firmId;
            const deletedProduct = await Firm.findByIdAndDelete(firmId);
            if(!deletedProduct){
                return res.status(404).json({error : "Product not found"})
            }
    
    }catch(error){
        console.error(error);
        res.status(500).json({error : "internal server error"})
    }
}




module.exports = {addFirm:[upload.single('image'), addFirm], deleteFirmById}
