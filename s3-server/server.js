// Loading environment variables
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const s3Router = require('./routes/s3');
const galleryRouter = require('./routes/gallery');

// Middleware for allowing us to connect to this API from frontend and make post requests to it
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5050;

// AWS S3 functionality endpoints
app.use('/s3', s3Router);

// Gallery functionality endpoints
app.use('/gallery', galleryRouter);

app.listen(PORT, () => {
  console.log(`🚀 App listening on ${PORT}`);
});