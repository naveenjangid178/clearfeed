import axiosInstance from "./axiosInstance"

const historyApi = {

    getHistory: async ({ page = 1, limit = 10, label = "", sort = "" } = {}) => {
        const params = new URLSearchParams()
        if (page)  params.append("page",  page)
        if (limit) params.append("limit", limit)
        if (label) params.append("label", label)
        if (sort)  params.append("sort",  sort)

        const res = await axiosInstance.get(`/history?${params.toString()}`)
        return res.data
    },

    getHistoryById: async (id) => {
        const res = await axiosInstance.get(`/history/${id}`)
        return res.data
    },

    deletePrediction: async (id) => {
        const res = await axiosInstance.delete(`/history/${id}`)
        return res.data
    },

    clearHistory: async () => {
        const res = await axiosInstance.delete("/history")
        return res.data
    }

}

export default historyApi