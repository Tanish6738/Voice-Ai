import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
);

export default AppRoutes;