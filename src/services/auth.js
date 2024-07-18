import api from './api';

const register = (email, password, name) => {
    return api.post('register', { email, password, name });
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