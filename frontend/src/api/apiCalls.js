import api from "../client";

export const createJobRequest = async (jobData) => {
    const response = await api.post('/jobs/', jobData);
    return response.data;
};

export const selectSkills = async (skills) => {
    const response = await api.put('/users/skills', { skills: skills });
    return response.data;
} 