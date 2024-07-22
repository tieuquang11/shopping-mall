import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay } from 'react-icons/fa';
import { SiShopee, SiGrab } from 'react-icons/si';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Customer Service</h3>
                    <ul>
                        <li><Link to="/help-center">Help Center</Link></li>
                        <li><Link to="/how-to-buy">How to Buy</Link></li>
                        <li><Link to="/shipping">Shipping & Delivery</Link></li>
                        <li><Link to="/returns">Returns & Refunds</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>About Shopping Mall</h3>
                    <ul>
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/careers">Careers</Link></li>
                        <li><Link to="/policies">Policies</Link></li>
                        <li><Link to="/privacy">Privacy</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Payment</h3>
                    <div className="payment-icons">
                        <FaCcVisa />
                        <FaCcMastercard />
                        <FaCcPaypal />
                        <FaCcApplePay />
                    </div>
                    <h3>Delivery</h3>
                    <div className="delivery-icons">
                        <SiShopee />
                        <SiGrab />
                        {/* Thêm các biểu tượng khác cho các đơn vị vận chuyển */}
                    </div>
                </div>
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Shopping Mall. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;