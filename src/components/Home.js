import React from 'react';
import ProductList from './ProductList';
import './Home.css';

const Home = ({ loggedInUser }) => {
    return (
        <div className="home">
            {loggedInUser && (
                <div className="welcome-message">
                    <h2>Welcome, {loggedInUser.username}!</h2>
                </div>
            )}
            <ProductList />
        </div>
    );
};

export default Home;
