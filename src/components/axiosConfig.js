

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3333/api/v1'; 

const secureRequest = async (method, url, data = null) => {
    const token = localStorage.getItem('accessToken');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await axios({
            method,
            url,
            headers,
            data,
        });
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw new Error('Request failed. Please try again later.');
    }
};

export default secureRequest;
