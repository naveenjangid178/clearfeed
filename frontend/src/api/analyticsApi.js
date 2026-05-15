import axiosInstance from "./axiosInstance"

const analyticsApi = {

    getAnalytics: async () => {
        const res = await axiosInstance.get("/analytics")
        return res.data
    }

}

export default analyticsApi