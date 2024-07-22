import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserEdit, FaHouseUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import {  IoMdLogIn, IoMdCart, IoMdPerson,} from 'react-icons/io';
import { toast } from 'react-toastify';
import './Layout.css';
import SearchBar from './SearchBar';
import Footer from './Footer';
import { useCart } from './CartContext';
import CategoryMenu from './CategoryMenu';

const Layout = ({ currentUser, onLogout, children }) => {
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
            onLogout();
            toast.success('Đăng xuất thành công!');
            navigate('/');
        }
    };

    return (
        <div className="layout-container">
            <header className="layout-header">
                <div className="logo" onClick={() => navigate('/')}>
                    <IoMdCart /> Shopping Mall
                </div>
                <div className="search-bar-container">
                    <SearchBar />
                </div>
                <nav className="navigation-links">
                    <ul>
                        <li><Link to="/"><FaHouseUser /> Home</Link></li>
                        {/* {currentUser && currentUser.role === 'admin' && (
                            <li><Link to="/product/new"><IoMdCube /> Product</Link></li>
                        )} */}
                        {!currentUser && <li><Link to="/register"><FaUserEdit /> Register</Link></li>}
                        {currentUser && currentUser.role === 'admin' && (
                            <li><Link to="/admin"><MdDashboard />Dashboard</Link></li>
                        )}
                        {!currentUser && <li><Link to="/login"><IoMdLogIn /> Login</Link></li>}
                        {currentUser && (
                            <>
                                <li>
                                    <Link to="/cart" className="cart-link">
                                        <IoMdCart /> Cart
                                        {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                                    </Link>
                                </li>
                                <li className="user-profile">
                                    <div className="avatar" onClick={() => navigate('/profile')}>
                                        {currentUser.avatar ? (
                                            <img className="avatar-img" src={currentUser.avatar} alt={currentUser.name} />
                                        ) : (
                                            <IoMdPerson className="default-avatar" />
                                        )}
                                        <span>{currentUser.name}</span>
                                    </div>
                                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>
            <div className="layout-body">
                <aside className="layout-sidebar">
                    <CategoryMenu />
                </aside>
                <main className="layout-content">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
