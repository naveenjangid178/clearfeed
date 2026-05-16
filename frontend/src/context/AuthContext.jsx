import { createContext, useContext, useState, useEffect } from "react"
import authApi from "../api/authApi.js"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user,    setUser   ] = useState(null)
    const [loading, setLoading] = useState(true)

    // On app load — check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            console.log(token)
            authApi.getMe()
                .then(res  => setUser(res.data))
                .catch(()  => localStorage.removeItem("token"))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        const res = await authApi.login({ email, password })
        localStorage.setItem("token", res.data.token)
        setUser(res.data.user)
        return res
    }

    const register = async (name, email, password) => {
        const res = await authApi.register({ name, email, password })
        localStorage.setItem("token", res.data.token)
        setUser(res.data.user)
        return res
    }

    const logout = async () => {
        await authApi.logout()
        localStorage.removeItem("token")
        setUser(null)
    }

    const updateUser = (updatedUser) => {
        setUser(updatedUser)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }
    return context
}