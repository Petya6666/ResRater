import React from 'react'
import './styles/index.css';
import Home from './pages/Home.jsx'
import Restaurants from './pages/Restaurants.jsx'
import Restaurant from './pages/Restaurant.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx';
import NewRestaurant from './pages/NewRestaurant.jsx';
import Favourites from './pages/Favourites.jsx';
import FloatingLines from './pages/FloatingLines.jsx';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          backgroundColor: '#1d0202'
        }}
      >
        <FloatingLines
          linesGradient={['#a30000', '#d10000', '#4f0303']}
          enabledWaves={['top', 'middle', 'bottom']}
          interactive={true}
          parallax={true}
          mixBlendMode="normal"
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/new-restaurant" element={<NewRestaurant />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favourites />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App