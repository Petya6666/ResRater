import React from 'react';
import '../styles/Header.css'; 


const Header = () => {
    return (
        <header className="header">
            
            <nav className="navbar">
            <img src="/logo.png" alt="Logo" className="logo" />
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <a href="/pages/Home.jsx" className="navbar-link">Home</a>
                    </li>
                    <li className="navbar-item">
                        <a href="/restaurants" className="navbar-link">Éttermek</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;