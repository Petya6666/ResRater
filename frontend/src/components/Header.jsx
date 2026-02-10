import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Header.css';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <Navbar className='navbar-custom'>
            <Container>
                <Navbar.Brand>
                    <Link to="/">
                        <img
                            src="/logo.png"
                            width="auto"
                            height="100"
                            className="d-inline-block align-top"
                        />
                    </Link>
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link className='colors' href="/">Kezdőlap</Nav.Link>
                    <Nav.Link className='colors' href="/restaurants">Éttermek</Nav.Link>
                </Nav>
                <Navbar.Brand className='loginpic' onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
                    <img
                        src="/loginpic.png"
                        width="auto"
                        height="80"
                        className="loginpic"
                    />
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <Link to="/register" className="dropdown-item">Regisztráció</Link>
                            <Link to="/login" className="dropdown-item">Bejelentkezés</Link>
                        </div>
                    )}
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
};

export default Header;

