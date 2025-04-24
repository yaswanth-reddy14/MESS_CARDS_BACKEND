const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const path = require('path');
const cors = require('cors');


const app = express()
const PORT = 4000;

dotEnv.config();
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("connected to mongoDB"))
    .catch((error) => console.log(error))

app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes)
app.use('/product',productRoutes);
app.use('/uploads', express.static('uploads'))

app.listen(PORT, () => {
    console.log(`server started running at ${PORT}`);

});
app.get('/home', (req, res) => {
    res.send("<h1> Welcome to MESS </h1>");
})



