import axios from 'axios';
import { LOGIN_URL } from './constants';

const handleLogin = async (email, password) => {
    try {
        const response = await axios.post(
            LOGIN_URL, 
            {
                email,
                password,
            }
        );
        return {
            status: response.status,
            data: {
                name: response.data.user.name,
                accessToken: response.data.user.accessToken,
                refreshToken: response.data.user.refreshToken,
                profileImage: response.data.user.profileImage,
                email: response.data.user.email,
            },
        };
    } catch (error) {
        // Handle errors, e.g., network issues or wrong credentials
        if (error.response) {
            return {
                status: error.response.status,
                data: null,
            };
        } else {
            return {
                status: 500,
                data: null,
            };
        }
    }
}

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post(
            'https://news.virtualdynamiclab.com/auth/refresh', {
            refreshToken,
        });
        return {
            status: response.status,
            data: {
                accessToken: response.data.accessToken,
            },
        };
    } catch (error) {
        if (error.response) {
            return {
                status: error.response.status,
                data: null,
            };
        } else {
            return {
                status: 500,
                data: null,
            };
        }
    }
};

const validateAccessToken = async () => {
    return await axios.get(
        'https://news.virtualdynamiclab.com/auth/validate_token',
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }
    );
};

const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('profileImage');
    window.location.href = '/';
};

export {
    handleLogin,
    handleLogout,
    refreshAccessToken,
    validateAccessToken
};