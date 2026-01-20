import api from '../client';


export const login = async ({username, password}) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async ({username, email, first_name, last_name, role, password}) => {
    try {
        const response = await api.post('/auth/register', { username, email, first_name, last_name, role, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};
