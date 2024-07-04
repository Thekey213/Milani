import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { Link } from 'react-router-dom';
import './Upload.css';

const Upload = () => {
  const [images, setImages] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "images"));
        const storage = getStorage();
        const uniqueImages = new Set();

        const imagesData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const imageRef = ref(storage, data.imagePath);
            try {
              const imageUrl = await getDownloadURL(imageRef);
              if (!uniqueImages.has(doc.id)) {
                uniqueImages.add(doc.id);
                return { id: doc.id, src: imageUrl, alt: data.alt || 'Image description', imagePath: data.imagePath };
              }
              return null;
            } catch (error) {
              if (error.code === 'storage/object-not-found') {
                console.warn(`Image not found: ${data.imagePath}`);
                return null;
              }
              throw error;
            }
          })
        );

        setImages(imagesData.filter(image => image !== null));
      } catch (error) {
        console.error('Error fetching images:', error);
        if (images.length === 0) {
          setError('Failed to fetch images. Please try again later.');
        }
      }
    };

    fetchImages();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name}`);
    try {
      await uploadBytes(storageRef, file);

      const imageUrl = await getDownloadURL(storageRef);
      await addDoc(collection(db, "images"), {
        imagePath: storageRef.fullPath,
        alt: file.name,
      });

      setImages((prevImages) => {
        if (prevImages.some(image => image.src === imageUrl)) {
          return prevImages;
        }
        return [...prevImages, { id: storageRef.name, src: imageUrl, alt: file.name, imagePath: storageRef.fullPath }];
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again later.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id, imagePath) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, imagePath);

      // Check if the image exists before attempting to delete
      try {
        await getDownloadURL(imageRef); // This will throw an error if the image doesn't exist
      } catch (error) {
        if (error.code === 'storage/object-not-found') {
          console.warn(`Image not found: ${imagePath}`);
          // Remove the Firestore document even if the image doesn't exist
          await deleteDoc(doc(db, "images", id));
          setImages(images.filter((image) => image.id !== id));
          return;
        } else {
          throw error; // Re-throw other errors
        }
      }

      // If the image exists, proceed to delete it
      await deleteObject(imageRef);
      await deleteDoc(doc(db, "images", id));
      setImages(images.filter((image) => image.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image. Please try again later.');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showImage = (imageSrc) => {
    setModalImage(imageSrc);
    const imageModal = new window.bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();
  };

  const handleModalClose = () => {
    setModalImage(null);
  };

  return (
    <div className="h-100">
      <div className="hero-ry">
        <div className="hero-text"></div>
      </div>

      <div className="p-3 text-center bg-light">
        <label htmlFor="file-input" className="upload-icon">
          <i className="bi bi-upload"></i>
        </label>
        <input
          id="file-input"
          type="file"
          onChange={handleImageUpload}
          disabled={uploading}
          className="file-input"
        />
        {uploading && <p>Uploading...</p>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>

      <div className="album py-2 bg-light">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {images.length === 0 && !error && (
              <div className="col text-center">
                <p>No images uploaded yet.</p>
              </div>
            )}
            {images.map((image) => (
              <div className="col" key={image.id}>
                <div className="card shadow-sm position-relative">
                  <img
                    className="bd-placeholder-img card-img-top"
                    src={image.src}
                    alt={image.alt}
                    onClick={() => showImage(image.src)}
                  />
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteImage(image.id, image.imagePath)}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <p className="col-md-4 mb-0 text-body-secondary">&copy; Milani Mtshotshisa, </p>
          <ul className="nav col-md-4 justify-content-end">
            <li className="nav-item"><Link to="/" className="nav-link px-2 text-body-secondary">Home</Link></li>
            <li className="nav-item"><Link to="/gallery" className="nav-link px-2 text-body-secondary">Gallery</Link></li>
          </ul>
        </footer>
      </div>

      <div className="modal fade" id="imageModal" tabIndex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleModalClose}></button>
            </div>
            <div className="modal-body">
              {modalImage && <img id="modalImage" className="img-fluid" src={modalImage} alt="Image Preview" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
