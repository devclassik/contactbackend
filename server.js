const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConnection');
const dotenv = require('dotenv').config();
const cors = require("cors");


connectDB();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/sendMail', require('./routes/mail/mail'));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server runing on ${port}`);
})
