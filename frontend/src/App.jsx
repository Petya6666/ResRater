import React from 'react'
import './styles/index.css';
import Home from './pages/Home.jsx'
import Restaurants from './pages/Restaurants.jsx'
import Register from './pages/Register.jsx'

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  

  return (
    <>
    <Router>
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/register" element={<Register />} />
          
        </Routes>
     </Router>  

    </>
  )
}

export default App
