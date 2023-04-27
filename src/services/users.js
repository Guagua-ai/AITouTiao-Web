import axios from 'axios';
import { roleToEnglish } from '../utils/i18n';
import { USERS_API_URL } from './constants';

const fetchUsers = async () => {
    try {
        const response = await axios.get(
            USERS_API_URL, 
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            },
        );

        return response.data.users;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return []; // Return an empty array when there is an error
    }
};

const updateUser = async (user) => {
    const updatedUser = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: roleToEnglish(user.role),
        profile_image: user.profile_image,
    };
    try {
        await axios.put(
            USERS_API_URL +  `/${user.id}`,
            updatedUser,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
    } catch (error) {
        console.error('Failed to update user:', error);
    }
};

const deleteUser = async (userId) => {
    await axios.delete(
        USERS_API_URL + `/${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
}

const promoteUser = async (userId) => {
    try {
        await axios.post(
            USERS_API_URL + `/promote/${userId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
    } catch (error) {
        console.error('Failed to promote user:', error);
    }
};

const demoteUser = async (user) => {
    const updatedUser = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: roleToEnglish('user'),
    };
    try {
        await axios.put(
            USERS_API_URL + `/${user.id}`,
            updatedUser,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
    } catch (error) {
        console.error('Failed to demote user:', error);
    }
};

export {
    fetchUsers,
    deleteUser,
    updateUser,
    promoteUser,
    demoteUser,
};
