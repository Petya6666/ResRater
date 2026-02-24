import React from 'react'
import './styles/index.css';
import Home from './pages/Home.jsx'
import Restaurants from './pages/Restaurants.jsx'
import Restaurant from './pages/Restaurant.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  

  return (
    <>
    <Router>
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
     </Router>  

    </>
  )
}

export default App