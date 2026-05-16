import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import { useAuth } from "../context/AuthContext"
import authApi from "../api/authApi"

export default function Profile() {
    const { user, updateUser, logout } = useAuth()
    const navigate                     = useNavigate()

    const [nameForm,    setNameForm   ] = useState({ name: user?.name || "", email: user?.email || "" })
    const [passForm,    setPassForm   ] = useState({ oldPassword: "", newPassword: "" })
    const [nameMsg,     setNameMsg    ] = useState({ text: "", type: "" })
    const [passMsg,     setPassMsg    ] = useState({ text: "", type: "" })
    const [nameLoading, setNameLoading] = useState(false)
    const [passLoading, setPassLoading] = useState(false)

    const handleUpdateAccount = async (e) => {
        e.preventDefault()
        setNameLoading(true)
        setNameMsg({ text: "", type: "" })
        try {
            const res = await authApi.updateAccount(nameForm)
            updateUser(res.data)
            setNameMsg({ text: "Account updated successfully", type: "success" })
        } catch (err) {
            setNameMsg({ text: err.response?.data?.message || "Update failed", type: "error" })
        } finally {
            setNameLoading(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (passForm.newPassword.length < 8) {
            setPassMsg({ text: "New password must be at least 8 characters", type: "error" })
            return
        }
        setPassLoading(true)
        setPassMsg({ text: "", type: "" })
        try {
            await authApi.changePassword(passForm)
            setPassMsg({ text: "Password changed successfully", type: "success" })
            setPassForm({ oldPassword: "", newPassword: "" })
        } catch (err) {
            setPassMsg({ text: err.response?.data?.message || "Password change failed", type: "error" })
        } finally {
            setPassLoading(false)
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <Navbar />

            <main className="max-w-2xl mx-auto px-4 py-10">

                <h1 className="text-2xl font-bold text-white mb-8">Profile</h1>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-8 bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <div className="w-16 h-16 bg-violet-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-white font-semibold">{user?.name}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                </div>

                {/* Update Account */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                    <h2 className="text-white font-semibold mb-5">Account Details</h2>

                    {nameMsg.text && (
                        <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${
                            nameMsg.type === "success"
                                ? "bg-green-900/30 text-green-400 border border-green-800"
                                : "bg-red-900/30 text-red-400 border border-red-800"
                        }`}>
                            {nameMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdateAccount} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={nameForm.name}
                                onChange={e => setNameForm({ ...nameForm, name: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={nameForm.email}
                                onChange={e => setNameForm({ ...nameForm, email: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={nameLoading}
                            className="self-start px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            {nameLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                    <h2 className="text-white font-semibold mb-5">Change Password</h2>

                    {passMsg.text && (
                        <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${
                            passMsg.type === "success"
                                ? "bg-green-900/30 text-green-400 border border-green-800"
                                : "bg-red-900/30 text-red-400 border border-red-800"
                        }`}>
                            {passMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Current Password</label>
                            <input
                                type="password"
                                value={passForm.oldPassword}
                                onChange={e => setPassForm({ ...passForm, oldPassword: e.target.value })}
                                placeholder="••••••••"
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">New Password</label>
                            <input
                                type="password"
                                value={passForm.newPassword}
                                onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                                placeholder="Min. 8 characters"
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={passLoading}
                            className="self-start px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                            {passLoading ? "Changing..." : "Change Password"}
                        </button>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-gray-900 border border-red-900 rounded-xl p-6">
                    <h2 className="text-red-400 font-semibold mb-2">Danger Zone</h2>
                    <p className="text-gray-500 text-sm mb-4">Sign out of your Veritas account</p>
                    <button
                        onClick={handleLogout}
                        className="px-5 py-2 bg-red-900/40 hover:bg-red-900/70 text-red-400 text-sm font-semibold border border-red-800 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </main>
        </div>
    )
}