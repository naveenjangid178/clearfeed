import axiosInstance from "./axiosInstance"

const feedbackApi = {

    submitFeedback: async (data) => {
        const res = await axiosInstance.post("/feedback", data)
        return res.data
    },

    getUserFeedback: async () => {
        const res = await axiosInstance.get("/feedback")
        return res.data
    },

    updateFeedback: async (id, data) => {
        const res = await axiosInstance.patch(`/feedback/${id}`, data)
        return res.data
    },

    deleteFeedback: async (id) => {
        const res = await axiosInstance.delete(`/feedback/${id}`)
        return res.data
    }

}

export default feedbackApi