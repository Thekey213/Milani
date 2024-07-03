import React from 'react';
import './Homepage.css'; // Assuming you have a corresponding App.css for styling
import Milani from '../../assets/img/Milani.jpg'
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div>
      <div className="hero-bg">
        <div className="hero-text">
          <h1>Milani Mtshotshisa</h1>
          <Link to="/gallery" className="hero-btn" >Gallery</Link>
        </div>
      </div>

      <div className="about ">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2>photographer + <br />faith</h2>
              <p>True vision is not by sight but it is to see even when the eyes are closed and to hear when ears are both closed. To be blind to the blinding world is to truly see.</p>
            </div>
            <div className="col-md-6">
              <img src={Milani} className="img-fluid milani-img" alt="Photographer Faith Image" />
            </div>
          </div>
        </div>
      </div>

      <div className="footer-img">
       
      </div>

      <div className="footer-im">
        <div className="container">
          <div className="footer-im-text">
            <h5 className="text-white">MILANI<br />MTSHOTSHISA</h5>

            <div className="contact-details">
              <div className="row pt-5 pb-5">
                <div className="col-sm">
                  <h2 className="text-white">Contacts</h2>
                </div>
                <div className="col-sm">
                  <h5 className="text-white"><b>Email:</b><br />mimimilani34@gmail.com</h5>
                </div>
                <div className="col-sm mt-2">
                  <h5 className="text-white"><b>Number:</b><br />066 043 4534</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
