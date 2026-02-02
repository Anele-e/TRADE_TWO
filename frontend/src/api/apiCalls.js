import api from "../client";

export const createJobRequest = async (jobData) => {
    const response = await api.post('/jobs/', jobData);
    return response.data;
};