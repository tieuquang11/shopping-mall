import api from './api';

const register = (email, password, name, address, phone) => {
    return api.post('register', { email, password, name, address, phone });
};

const login = (email, password) => {
    return api.post('login', { email, password });
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    register,
    login,
    logout
};