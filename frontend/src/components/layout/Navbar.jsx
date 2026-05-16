import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const navLinks = [
    { path: "/",          label: "Analyzer"  },
    { path: "/history",   label: "History"   },
    { path: "/analytics", label: "Analytics" },
]

export default function Navbar() {
    const { user, logout }    = useAuth()
    const location            = useLocation()
    const navigate            = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        navigate("/login")
    }

    return (
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">V</span>
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">Veritas</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                location.pathname === link.path
                                    ? "bg-violet-600 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right side */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <div className="w-8 h-8 bg-violet-700 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className="text-sm">{user?.name}</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-gray-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        }
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-800 px-4 py-3 flex flex-col gap-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMenuOpen(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                location.pathname === link.path
                                    ? "bg-violet-600 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg text-sm text-left text-red-400 hover:text-red-300 hover:bg-gray-800"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    )
}