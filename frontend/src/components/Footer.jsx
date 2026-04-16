import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className='site-footer'>
      <p className='site-footer-text'>Copyright &copy; 2026 ResRater Inc. Minden jog fenntartva.</p>
      Ha bármilyen kérdése van, írjon nekünk: <a className='site-footer-email' href=''>resraterhelp@gmail.com</a>
    </footer>
  );
};

export default Footer;