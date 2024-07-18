/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3333/api/v1/register', {
                name,
                email,
                password,
            });
            console.log(response.data);
            setMessage('Registration successful! Redirecting...');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error) {
            console.error(error);
            setMessage('Registration failed! Please try again.');
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="register-container">
            <h2 className="register-heading">Register</h2>
            {message && <p className="message">{message}</p>}
            <form className="register-form" onSubmit={handleRegister}>
                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <button type="submit" className="form-button">
                    Register
                </button>
            </form>
            <div className="register-footer">
                <p>Or <a className="login-link" onClick={goToLogin}>Login</a></p>
            </div>
        </div>
    );
};

export default Register;
