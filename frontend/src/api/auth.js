import api from '../client';

function validateInput(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{6,}$/;
    if (!input.username || !input.password) {
        throw new Error('Username and password are required');
    }
    
    if (input.password.length < 6 || !passwordRegex.test(input.password)) {
        throw new Error('Password must be at least 6 characters long or contain both letters and numbers');
    }
    if (input.email && !emailRegex.test(input.email)) {
        throw new Error('Invalid email format');
    }
}




export const login = async ({username, password}) => {
    validateInput({username, password});
    try {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async ({username, email, first_name, last_name, role, password}) => {
    validateInput({username, email, password});
    try {
        const response = await api.post('/auth/register', { username, email, first_name, last_name, role, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMe = async () => {
    const response = await api.get('/users/me');
    return response.data;
};