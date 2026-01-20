import React from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Header.css';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
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
                    <Nav.Link className='colors' href="/">Home</Nav.Link>
                    <Nav.Link className='colors' href="/restaurants">Restaurants</Nav.Link>
                </Nav>
                <Navbar.Brand className='loginpic'>
                    <Link to="/login">
                        <img
                            src="/loginpic.png"
                            width="auto"
                            height="80"
                            className="loginpic"
                        />
                    </Link>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
};

export default Header;