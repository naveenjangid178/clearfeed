import { useState, useEffect } from "react"
import Navbar from "../components/layout/Navbar"
import { Badge } from "../components/ui/ui-components"
import historyApi from "../api/historyApi"
import { formatDate } from "../utils/formatData"

export default function History() {
    const [predictions, setPredictions] = useState([])
    const [pagination,  setPagination ] = useState(null)
    const [loading,     setLoading    ] = useState(true)
    const [filter,      setFilter     ] = useState("")
    const [sort,        setSort       ] = useState("")
    const [page,        setPage       ] = useState(1)
    const [clearing,    setClearing   ] = useState(false)

    const fetchHistory = async () => {
        setLoading(true)
        try {
            const res = await historyApi.getHistory({ page, limit: 10, label: filter, sort })
            setPredictions(res.data.predictions)
            setPagination(res.data.pagination)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchHistory() }, [page, filter, sort])

    const handleDelete = async (id) => {
        try {
            await historyApi.deletePrediction(id)
            setPredictions(prev => prev.filter(p => p._id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    const handleClearAll = async () => {
        if (!window.confirm("Are you sure you want to clear all history?")) return
        setClearing(true)
        try {
            await historyApi.clearHistory()
            setPredictions([])
            setPagination(null)
        } catch (err) {
            console.error(err)
        } finally {
            setClearing(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">History</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {pagination?.total ?? 0} articles analyzed
                        </p>
                    </div>
                    {predictions.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            disabled={clearing}
                            className="text-sm text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {clearing ? "Clearing..." : "Clear All"}
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-6 flex-wrap">
                    {["", "FAKE", "REAL"].map(f => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setPage(1) }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                filter === f
                                    ? "bg-violet-600 text-white"
                                    : "bg-gray-800 text-gray-400 hover:text-white"
                            }`}
                        >
                            {f === "" ? "All" : f}
                        </button>
                    ))}
                    <button
                        onClick={() => setSort(sort === "oldest" ? "" : "oldest")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ml-auto ${
                            sort === "oldest"
                                ? "bg-violet-600 text-white"
                                : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                    >
                        {sort === "oldest" ? "Oldest First" : "Newest First"}
                    </button>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : predictions.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No predictions yet</p>
                        <p className="text-gray-600 text-sm mt-1">Go to the Analyzer to get started</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {predictions.map(p => (
                            <div
                                key={p._id}
                                className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-start justify-between gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm truncate mb-2">
                                        {p.sourceUrl || p.text?.slice(0, 100) + "..."}
                                    </p>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <Badge label={p.label} />
                                        <span className={`text-xs font-medium ${
                                            p.label === "REAL" ? "text-green-400" : "text-red-400"
                                        }`}>
                                            {p.confidence}% confident
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(p.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(p._id)}
                                    className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                                    title="Delete"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={!pagination.hasPrevPage}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-500">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!pagination.hasNextPage}
                            className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}