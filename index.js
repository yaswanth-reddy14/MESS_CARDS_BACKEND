const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');


const app = express()

const PORT = process.env.PORT || 4000;

dotEnv.config();


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("connected to mongoDB"))
    .catch((error) => console.log(error))

app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes)
app.use('/product',productRoutes);


app.listen(PORT, () => {
    console.log(`server started running at ${PORT}`);

});
app.use('/', (req, res) => {
    res.send("<h1> Welcome to MESS </h1>");
})



