const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require("cors");
const v1Routes = require('./routes/index')
const bodyParser = require('body-parser');


connectDB();

const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use('/api/v1', v1Routes);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server runing on ${port}`);
})
