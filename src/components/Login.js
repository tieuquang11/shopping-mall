import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import auth from '../services/auth';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await auth.login(email, password);
            const { user, accessToken } = response.data;

            const userWithRole = {
                ...user,
                role: response.data.role || user.role
            };
            let token;
            if (typeof accessToken === 'string') {
                token = accessToken;
            } else if (typeof accessToken === 'object') {
                token = accessToken.token || accessToken.value;
            }

            if (!token) {
                throw new Error('Token không hợp lệ');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userWithRole));
            onLogin(userWithRole);
            toast.success('Đăng nhập thành công!');
            navigate('/profile');
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || error.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="login-container">
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default Login;