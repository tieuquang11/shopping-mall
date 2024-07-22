/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3333/api/v1/register', {
                name,
                email,
                password,
                address,
                phone
            });
            console.log(response.data);
            setMessage('Đăng ký thành công! Đang chuyển hướng...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error(error);
            setMessage('Đăng ký thất bại! Vui lòng thử lại.');
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="register-container">
            <h2 className="register-heading">Đăng ký</h2>
            {message && <p className="message">{message}</p>}
            <form className="register-form" onSubmit={handleRegister}>
                <div className="form-group">
                    <label className="form-label">Họ tên</label>
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
                    <label className="form-label">Mật khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Địa chỉ</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <button type="submit" className="form-button">
                    Đăng ký
                </button>
            </form>
            <div className="register-footer">
                <p>Hoặc <a className="login-link" onClick={goToLogin}>Đăng nhập</a></p>
            </div>
        </div>
    );
};

export default Register;