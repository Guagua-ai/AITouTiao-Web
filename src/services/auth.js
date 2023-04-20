import axios from 'axios';

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post('https://news.virtualdynamiclab.com/auth/refresh', {
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

const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('profileImage');
    window.location.href = '/';
};

export {
    refreshAccessToken,
    handleLogout
};