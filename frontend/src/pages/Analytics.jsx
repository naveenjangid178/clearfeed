import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import Navbar from "../components/layout/Navbar"
import analyticsApi from "../api/analyticsApi"

export default function Analytics() {
    const [data,    setData   ] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        analyticsApi.getAnalytics()
            .then(res  => setData(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="min-h-screen bg-gray-950">
            <Navbar />
            <div className="flex justify-center items-center py-40">
                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    )

    if (!data) return null

    const { overview, confidence, keywords, charts, recentActivity } = data

    return (
        <div className="min-h-screen bg-gray-950">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 py-10">

                <h1 className="text-2xl font-bold text-white mb-8">Analytics</h1>

                {/* Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Analyzed", value: overview.totalAnalyzed, color: "text-violet-400" },
                        { label: "Fake Articles",  value: overview.fakeCount,     color: "text-red-400"    },
                        { label: "Real Articles",  value: overview.realCount,     color: "text-green-400"  },
                        { label: "Fake Rate",      value: `${overview.fakePercentage}%`, color: "text-orange-400" },
                    ].map(card => (
                        <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                            <p className="text-gray-500 text-xs mb-1">{card.label}</p>
                            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">

                    {/* Pie Chart */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                        <h2 className="text-white font-semibold mb-4 text-sm">Fake vs Real</h2>
                        {overview.totalAnalyzed === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-10">No data yet</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={charts.pieChart}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {charts.pieChart.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                                        labelStyle={{ color: "#9ca3af" }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                        <div className="flex justify-center gap-6 mt-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-xs text-gray-400">Fake ({overview.fakePercentage}%)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-xs text-gray-400">Real ({overview.realPercentage}%)</span>
                            </div>
                        </div>
                    </div>

                    {/* Line Chart */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                        <h2 className="text-white font-semibold mb-4 text-sm">Last 7 Days Activity</h2>
                        {charts.lineChart.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-10">No data yet</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={charts.lineChart}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="_id" tick={{ fill: "#6b7280", fontSize: 11 }} />
                                    <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                                        labelStyle={{ color: "#9ca3af" }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                    <Line type="monotone" dataKey="fake" stroke="#EF4444" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="real" stroke="#22C55E" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Keywords + Confidence Row */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">

                    {/* Top Fake Keywords */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                        <h2 className="text-white font-semibold mb-4 text-sm">Top Fake Keywords</h2>
                        {keywords.topFakeKeywords.length === 0 ? (
                            <p className="text-gray-500 text-sm">No data yet</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {keywords.topFakeKeywords.map((kw, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                                        <div className="flex-1 bg-gray-800 rounded-full h-2">
                                            <div
                                                className="bg-red-500 h-2 rounded-full"
                                                style={{ width: `${(kw.count / keywords.topFakeKeywords[0].count) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-300 w-16 truncate">{kw.word}</span>
                                        <span className="text-xs text-gray-500">{kw.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Top Real Keywords */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                        <h2 className="text-white font-semibold mb-4 text-sm">Top Real Keywords</h2>
                        {keywords.topRealKeywords.length === 0 ? (
                            <p className="text-gray-500 text-sm">No data yet</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {keywords.topRealKeywords.map((kw, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                                        <div className="flex-1 bg-gray-800 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{ width: `${(kw.count / keywords.topRealKeywords[0].count) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-300 w-16 truncate">{kw.word}</span>
                                        <span className="text-xs text-gray-500">{kw.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Confidence Averages */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
                        <p className="text-xs text-gray-500 mb-1">Avg Confidence on FAKE</p>
                        <p className="text-3xl font-bold text-red-400">{confidence.avgFakeConfidence}%</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
                        <p className="text-xs text-gray-500 mb-1">Avg Confidence on REAL</p>
                        <p className="text-3xl font-bold text-green-400">{confidence.avgRealConfidence}%</p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <h2 className="text-white font-semibold mb-4 text-sm">Recent Activity</h2>
                    {recentActivity.length === 0 ? (
                        <p className="text-gray-500 text-sm">No activity yet</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {recentActivity.map((a, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <p className="text-gray-300 text-sm truncate flex-1 mr-4">
                                        {a.sourceUrl || a.text?.slice(0, 60) + "..."}
                                    </p>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                        a.label === "REAL"
                                            ? "bg-green-900/40 text-green-400"
                                            : "bg-red-900/40 text-red-400"
                                    }`}>
                                        {a.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}