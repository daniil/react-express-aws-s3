const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuid } = require('uuid');

const { AWSBucketName } = process.env;
const filePath = './data/galleryData.json'; 

// Helper function to read a JSON file
const readFile = () => {
  return JSON.parse(fs.readFileSync(filePath));
}

// Helper function to write to a JSON file
const writeFile = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data));
}

// GET /gallery
// returns all gallery items
router.get('/', (_req, res) => {
  res.status(200).json(readFile());
});

// POST /gallery
// creates new gallery item
router.post('/', (req, res) => {
  const { title, fileName } = req.body;

  // Get current gallery JSON
  const galleryArr = readFile();

  // Create a new gallery item with unique ID, title from frontend and image source that points to S3 URL (using bucket name and the unique file name we generated from "/s3/get-signed-url" endpoint call)
  const newItem = {
    id: uuid(),
    title: title,
    src: `https://${AWSBucketName}.s3.amazonaws.com/${fileName}`
  };

  // Add new gallery item to beginning of the gallery
  galleryArr.unshift(newItem);

  // Update JSON with updated gallery array
  writeFile(galleryArr);

  // Send back a response with a new item as payload
  res.status(201).json(newItem);
});

module.exports = router;