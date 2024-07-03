import React from 'react';
import './App.css'; // Assuming you have a corresponding App.css for styling
import Homepage from './pages/home/Homepage';
import Gallery from './pages/gallery/Gallery';
import Upload from './pages/upload/Upload';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router basename="/Milani">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/upload" element={<Upload />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
