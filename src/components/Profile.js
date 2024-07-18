import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ currentUser }) => {
    const [name, setName] = useState(currentUser?.name || '');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(currentUser?.avatar || 'https://via.placeholder.com/150');

    const handleNameChange = (e) => setName(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement API call to update user information
        console.log('Update user:', { name, password, avatar });
    };

    const handleDelete = () => {
        // Implement API call to delete user account
        console.log('Delete user account');
    };

    if (!currentUser) {
        return <div className="profile-page">Please log in to view your profile.</div>;
    }

    return (
        <div className="profile-page">
            <h2>Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="avatar-container">
                    <img className="avatar" src={avatar} alt={name} />
                    <input type="file" onChange={handleAvatarChange} accept="image/*" />
                </div>
                <div className="user-info">
                    <label>
                        Name:
                        <input type="text" value={name} onChange={handleNameChange} />
                    </label>
                    <label>
                        New Password:
                        <input type="password" value={password} onChange={handlePasswordChange} />
                    </label>
                    <button type="submit">Update Profile</button>
                </div>
            </form>
            <button onClick={handleDelete} className="delete-account">Delete Account</button>
        </div>
    );
};

export default Profile;