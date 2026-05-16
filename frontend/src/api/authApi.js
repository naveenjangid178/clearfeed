import axiosInstance from "./axiosInstance"

const authApi = {

    register: async (data) => {
        const res = await axiosInstance.post("/users/register", data)
        return res.data
    },

    login: async (data) => {
        const res = await axiosInstance.post("/users/login", data)
        console.log(res)
        return res.data
    },

    logout: async () => {
        const res = await axiosInstance.post("/users/logout")
        return res.data
    },

    getMe: async () => {
        const res = await axiosInstance.get("/users/me")
        return res.data
    },

    changePassword: async (data) => {
        const res = await axiosInstance.patch("/users/change-password", data)
        return res.data
    },

    updateAccount: async (data) => {
        const res = await axiosInstance.patch("/users/update", data)
        return res.data
    }

}

export default authApi