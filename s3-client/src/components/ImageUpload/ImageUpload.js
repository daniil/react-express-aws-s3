import { useState } from 'react';
import axios from 'axios';
import './ImageUpload.scss';

// Get API url from environment variable
const GALLERY_SERVER_URL = process.env.REACT_APP_GALLERY_SERVER_URL;

const ImageUpload = ({ onUpload }) => {
  // When we are uploading an image, we want to disable the upload button
  const [isUploading, setIsUploading] = useState(false);

  // Upload form submit handler
  const handleUpload = (e) => {
    // Stops page from refreshing
    e.preventDefault();

    // Get the title and file values from the form
    const form = e.target;
    const imgTitle = form.imgTitle.value;
    const imgFile = form.imgFile.files[0];

    // For storing the unique filename we get back from our API
    let fileName;

    // Disable the upload button
    setIsUploading(true);

    // Request the upload URL for the file from AWS
    axios
      .post(`${GALLERY_SERVER_URL}/s3/get-signed-url`, {
        fileName: imgFile.name,
        fileType: imgFile.type
      })
      .then((res) => {
        // Store the unique filename we get back from API in a variable
        fileName = res.data.fileName;

        // Upload the file to the AWS using the unique upload URL
        return axios.put(res.data.url, imgFile, {
          headers: {
            'Content-Type': imgFile.type
          }
        });
      })
      .then(() => {
        // Make a post request to API to store the gallery item in JSON with a title and file name
        return axios.post(`${GALLERY_SERVER_URL}/gallery`, {
          title: imgTitle,
          fileName
        });
      })
      .then(() => {
        // Reset the upload form
        form.reset();

        // Re-enable the upload button
        setIsUploading(false);

        // Refetch the gallery items
        onUpload();
      })
      .catch((err) => { console.log(err) });
  }


  return (
    <form onSubmit={handleUpload} className="image-upload">
      <h2 className="image-upload__title">Upload your image</h2>
      <div className="image-upload__field">
        <label className="image-upload__label" htmlFor="imgTitle">Image Title</label>
        <input className="image-upload__input" type="text" name="imgTitle" id="imgTitle" placeholder="Image Title" required/>
      </div>
      <div className="image-upload__field">
        <label className="image-upload__label" htmlFor="imgFile">Image File</label>
        <input className="image-upload__input" type="file" name="imgFile" id="imgFile" required accept="image/*"/>
      </div>
      <button className="image-upload__submit" type="submit" disabled={isUploading}> Upload to Gallery</button>
    </form>
  )
}

export default ImageUpload;