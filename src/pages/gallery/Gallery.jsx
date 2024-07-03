import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "images"));
        const storage = getStorage();

        const uniqueImages = new Set(); // Set to track unique image URLs
        const imagesData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const imageRef = ref(storage, data.imagePath);

            try {
              const imageUrl = await getDownloadURL(imageRef);
              if (!uniqueImages.has(imageUrl)) {
                uniqueImages.add(imageUrl);
                return { id: doc.id, src: imageUrl, alt: data.alt || 'Image description' };
              } else {
                return null; // Return null for duplicate images
              }
            } catch (error) {
              if (error.code === 'storage/object-not-found') {
                console.warn(`Image not found: ${data.imagePath}`);
                return null; // Return null for images not found
              }
              throw error;
            }
          })
        );

        setImages(imagesData.filter(image => image !== null)); // Filter out null entries
      } catch (error) {
        console.error('Error fetching images:', error);
        setError('Failed to fetch images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

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
      <style>{`
        .hero-bg {
          background-image: linear-gradient(rgba(78, 58, 81, 0.4), rgba(78, 58, 81, 0.4)), url("/src/assets/img/21.jpeg");
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          position: relative;
          height: 100vh;
        }

        .back-to-top-btn, .home-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background-color: #303F3C; 
          color: #fff;
          border: none;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
        }

       

        .card img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      `}</style>

      <div className="hero-bg">
        <div className="hero-text"></div>
      </div>

      <div className="p-3 text-center bg-light">
        {loading && <div className="alert alert-info">Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && images.length === 0 && !error && <div className="alert alert-info">No images yet.</div>}
      </div>

      <div className="album py-2 bg-light">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {images.map((image) => (
              <div className="col" key={image.id}>
                <div className="card shadow-sm">
                  <img
                    className="bd-placeholder-img card-img-top"
                    src={image.src}
                    alt={image.alt}
                    onClick={() => showImage(image.src)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link to="/upload">
        <button className="home-btn">
          <i className="bi bi-house"></i>
        </button>
      </Link>



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

export default Gallery;
