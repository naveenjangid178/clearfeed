import axiosInstance from "./axiosInstance"

const predictionApi = {

    analyzeText: async (text) => {
        const res = await axiosInstance.post("/predictions/analyze", { text })
        return res.data
    },

    analyzeUrl: async (url) => {
        const res = await axiosInstance.post("/predictions/analyze-url", { url })
        return res.data
    },

    getPrediction: async (id) => {
        const res = await axiosInstance.get(`/predictions/${id}`)
        return res.data
    }

}

export default predictionApi