import api from "../client";

export const createJobRequest = async (jobData) => {
    const response = await api.post('/jobs/', jobData);
    return response.data;
};

export const selectSkills = async (skills) => {
    console.log("Sending skills data:", { skills: skills });
    try{
        const response = await api.put('/users/skills', { skills: skills });
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error details:", error.response?.data);
        throw error;
    }
    
} 