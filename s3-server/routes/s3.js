const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

// Destructuring all the environment variables
const {
  AWSAccessKeyId,
  AWSSecretKey,
  AWSBucketName,
  AWSRegion
} = process.env;

// Configure AWS library with your credentials
AWS.config.update({
  accessKeyId: AWSAccessKeyId,
  secretAccessKey: AWSSecretKey
});

// Expiration time for generated upload URL
const URL_EXPIRATION_TIME = 60; // in seconds

// S3 Bucket information
const myBucket = new AWS.S3({
  params: { Bucket: AWSBucketName },
  region: AWSRegion
});

// Since filenames in S3 bucket need to be unique, we have this helper function that breaks down user uploaded file by it's name and extension and then adds timestamp to it, converting something like "image.jpg" into "image-1668202200849.jpg"
const generateUniqueFilename = (fileName) => {
  // Destructure the name and extension from filename split by a period
  const [name, extension] = fileName.split('.');
  const uniqueFileName = `${name}-${Date.now()}.${extension}`;
  return uniqueFileName;
}

// Endpoint for requesting a unique upload URL from AWS
router.post('/get-signed-url', (req, res) => {
  const { fileName, fileType } = req.body;

  // Generate a unique filename for S2 based on uploaded file name
  const uniqueFileName = generateUniqueFilename(fileName);

  // Using AWS SDK we make a call to AWS to get a unique upload URL
  myBucket.getSignedUrl('putObject', {
    Key: uniqueFileName,
    ContentType: fileType,
    Expires: URL_EXPIRATION_TIME
  } , (err , url) => {
    // Send error response back if something went wrong
    if (err) {
      return res.status(500).send(err);
    }

    // If all is well we send back response with the unique upload URL and also a unique file name that we generated for uploading to S3 (we will need that file name to store in our gallery JSON)
    res.status(200).json({ 
      url,
      fileName: uniqueFileName
    });
  });
});

module.exports = router;