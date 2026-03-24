import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Header.css';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!dropdownRef.current?.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setShowDropdown(false);
        setExpanded(false);
        navigate('/');
    };

    const closeMenus = () => {
        setExpanded(false);
        setShowDropdown(false);
    };

    return (
        <Navbar className='navbar-custom' expand='lg' expanded={expanded} onToggle={setExpanded}>
            <Container fluid='lg' className='navbar-inner'>
                <Navbar.Brand className='brand-logo'>
                    <Link to="/" onClick={closeMenus}>
                        <img
                            src="/logo.png"
                            alt='ResRater logo'
                            className='brand-logo-image'
                        />
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='main-navigation' />

                <Navbar.Collapse id='main-navigation'>
                    <Nav className='navbar-links me-auto'>
                        <Nav.Link as={Link} className='colors' to='/' onClick={closeMenus}>Kezdőlap</Nav.Link>
                        <Nav.Link as={Link} className='colors' to='/restaurants' onClick={closeMenus}>Éttermek</Nav.Link>
                        <Nav.Link as={Link} className='colors' to='/new-restaurant' onClick={closeMenus}>Új étterem</Nav.Link>
                    </Nav>

                    <div className='user-menu-wrapper' ref={dropdownRef}>
                        <button type='button' className='profile-trigger' onClick={toggleDropdown} aria-label='Felhasználói menü'>
                            <img src='/loginpic.png' alt='Profil menü' className='loginpic' />
                        </button>

                        {showDropdown && (
                            <div className='profile-dropdown-menu'>
                                {token ? (
                                    <>
                                        <Link to='/profile' className='profile-dropdown-item' onClick={closeMenus}>Profil</Link>
                                        <button onClick={handleLogout} className='profile-dropdown-item' type='button'>Kijelentkezés</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to='/register' className='profile-dropdown-item' onClick={closeMenus}>Regisztráció</Link>
                                        <Link to='/login' className='profile-dropdown-item' onClick={closeMenus}>Bejelentkezés</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;

