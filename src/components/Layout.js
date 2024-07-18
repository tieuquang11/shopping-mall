import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdHome, IoMdCube, IoMdPersonAdd, IoMdLogIn, IoMdCart, IoMdPerson } from 'react-icons/io';
import './Layout.css';
import SearchBar from './SearchBar';
import CategoryMenu from './CategoryMenu';

const Layout = ({ currentUser, onLogout, children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/');
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
                        <li><Link to="/"><IoMdHome /> Home</Link></li>
                        {currentUser && currentUser.role === 'admin' && (
                            <li><Link to="/product/new"><IoMdCube /> Product</Link></li>
                        )}
                        {!currentUser && <li><Link to="/register"><IoMdPersonAdd /> Register</Link></li>}
                        {!currentUser && <li><Link to="/login"><IoMdLogIn /> Login</Link></li>}
                        {currentUser && (
                            <>
                                <li>
                                    <Link to="/cart">
                                        <IoMdCart /> Cart
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
        </div>
    );
};

export default Layout;
