import axios from "axios";

export const httpClient = {
    get: async (url: string, params?: any) => {
        try {
            const response = await axios.get(url, { params });
            return response.data;
        } catch (error) {
            console.error("HTTP GET Error:", error);
            throw error;
        }
    },
    post: async (url: string, data?: any) => {
        try {
            const response = await axios.post(url, data);
            return response.data;
        } catch (error) {
            console.error("HTTP POST Error:", error);
            throw error;
        }
    },
    put: async (url: string, data?: any) => {
        try {
            const response = await axios.put(url, data);
            return response.data;
        } catch (error) {
            console.error("HTTP PUT Error:", error);
            throw error;
        }
    },
    delete: async (url: string, params?: any) => {
        try {
            const response = await axios.delete(url, { params });
            return response.data;
        } catch (error) {
            console.error("HTTP DELETE Error:", error);
            throw error;
        }
    }
}