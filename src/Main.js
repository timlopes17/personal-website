import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App'; // Assuming you have a separate App component for the main page
import Movies from './pages/Movies';
// import other necessary components

function Main() {
  // If you have any state or logic that applies to all routes, you can include it here

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/movies" element={<Movies />} />
        {/* Define other routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
