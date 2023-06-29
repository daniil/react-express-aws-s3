import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageUpload from './components/ImageUpload/ImageUpload';
import Gallery from './components/Gallery/Gallery';
import './App.scss';

const GALLERY_SERVER_URL = process.env.REACT_APP_GALLERY_SERVER_URL;

const App = () => {
  // Gallery items array
  const [galleryItems, setGalleryItems] = useState([]);

  // Function that makes a GET request to API /gallery endpoint and updates state
  const refreshGallery = () => {
    axios
      .get(`${GALLERY_SERVER_URL}/gallery`)
      .then((res) => {
        setGalleryItems(res.data);
      });
  }

  // Fetch gallery items when the application first loads
  useEffect(() => {
    refreshGallery();
  }, []);

  return (
    <>
      <h1 className="title">AWS S3 Image Gallery</h1>
      <main className="app">
        <ImageUpload onUpload={refreshGallery}/>
        <Gallery items={galleryItems}/>
      </main>
    </>
  );
}

export default App;
