import { useState } from "react"
import Navbar from "../components/layout/Navbar"
import { Badge } from "../components/ui/ui-components"
import { ConfidenceMeter } from "../components/ui/ui-components"
import { WordHighlighter } from "../components/ui/ui-components"
import predictionApi from "../api/predictionApi"
import feedbackApi from "../api/feedbackApi"

const TABS = ["Text", "URL"]

export default function Analyzer() {
    const [activeTab,   setActiveTab  ] = useState("Text")
    const [text,        setText       ] = useState("")
    const [url,         setUrl        ] = useState("")
    const [result,      setResult     ] = useState(null)
    const [loading,     setLoading    ] = useState(false)
    const [error,       setError      ] = useState("")
    const [feedback,    setFeedback   ] = useState(null)
    const [fbLoading,   setFbLoading  ] = useState(false)
    const [fbSubmitted, setFbSubmitted] = useState(false)

    const handleAnalyze = async () => {
        setError("")
        setResult(null)
        setFeedback(null)
        setFbSubmitted(false)

        if (activeTab === "Text" && text.trim().length < 20) {
            setError("Please enter at least 20 characters of article text.")
            return
        }
        if (activeTab === "URL" && url.trim() === "") {
            setError("Please enter a valid URL.")
            return
        }

        setLoading(true)
        try {
            const res = activeTab === "Text"
                ? await predictionApi.analyzeText(text)
                : await predictionApi.analyzeUrl(url)
            setResult(res.data)
        } catch (err) {
            setError(err.response?.data?.message || "Analysis failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleFeedback = async (correctLabel) => {
        if (!result?._id) return
        setFbLoading(true)
        try {
            await feedbackApi.submitFeedback({
                predictionId: result._id,
                correctLabel,
                comment: feedback || null
            })
            setFbSubmitted(true)
        } catch (err) {
            console.error(err)
        } finally {
            setFbLoading(false)
        }
    }

    const handleReset = () => {
        setText("")
        setUrl("")
        setResult(null)
        setError("")
        setFeedback(null)
        setFbSubmitted(false)
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 py-10">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Is this news <span className="text-violet-400">real?</span>
                    </h1>
                    <p className="text-gray-400">Paste an article or a URL and let our AI decide.</p>
                </div>

                {/* Input Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setError("") }}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab
                                        ? "bg-violet-600 text-white"
                                        : "text-gray-400 hover:text-white bg-gray-800"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    {activeTab === "Text" ? (
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Paste the full news article here..."
                            rows={7}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                        />
                    ) : (
                        <input
                            type="url"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="https://www.reuters.com/article/..."
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    )}

                    {error && (
                        <p className="text-red-400 text-sm mt-2">{error}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : "Analyze"}
                        </button>
                        {result && (
                            <button
                                onClick={handleReset}
                                className="px-4 py-2.5 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-colors text-sm"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Result Card */}
                {result && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-5">

                        {/* Label + Confidence */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Verdict</p>
                                <Badge label={result.label} />
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 mb-1">Model</p>
                                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-lg">
                                    {result.modelUsed}
                                </span>
                            </div>
                        </div>

                        {/* Confidence Meter */}
                        <ConfidenceMeter confidence={result.confidence} label={result.label} />

                        {/* Keywords */}
                        {result.topKeywords?.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Key Signals</p>
                                <div className="flex flex-wrap gap-2">
                                    {result.topKeywords.map((kw, i) => (
                                        <span
                                            key={i}
                                            className={`text-xs px-2.5 py-1 rounded-full border ${
                                                result.label === "REAL"
                                                    ? "bg-green-900/30 text-green-400 border-green-800"
                                                    : "bg-red-900/30 text-red-400 border-red-800"
                                            }`}
                                        >
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Article preview with highlights */}
                        {activeTab === "Text" && text && (
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Article Preview</p>
                                <div className="bg-gray-800 rounded-xl p-4 max-h-40 overflow-y-auto">
                                    <WordHighlighter
                                        text={text.slice(0, 600)}
                                        keywords={result.topKeywords}
                                        label={result.label}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Feedback */}
                        <div className="border-t border-gray-800 pt-4">
                            {fbSubmitted ? (
                                <p className="text-green-400 text-sm text-center">
                                    Thanks for your feedback!
                                </p>
                            ) : (
                                <div>
                                    <p className="text-xs text-gray-500 mb-3">Was this prediction correct?</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleFeedback(result.label)}
                                            disabled={fbLoading}
                                            className="flex-1 py-2 text-sm text-green-400 border border-green-800 hover:bg-green-900/30 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            Yes, correct
                                        </button>
                                        <button
                                            onClick={() => handleFeedback(result.label === "FAKE" ? "REAL" : "FAKE")}
                                            disabled={fbLoading}
                                            className="flex-1 py-2 text-sm text-red-400 border border-red-800 hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            No, it's {result.label === "FAKE" ? "REAL" : "FAKE"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}