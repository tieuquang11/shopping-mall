import React from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = ({ currentUser }) => {
    if (!currentUser) {
        return <div>Please login to view your profile.</div>;
    }

    return (
        <div className="profile">
            <h2>My Profile</h2>
            <div className="profile-info">
                <p><strong>Name:</strong> {currentUser.name}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
            </div>
            <div className="profile-actions">
                <Link to="/user/products" className="manage-products-btn">Manage My Products</Link>
            </div>
        </div>
    );
};

export default Profile;