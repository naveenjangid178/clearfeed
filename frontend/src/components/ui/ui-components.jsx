// Badge.jsx
export function Badge({ label }) {
    const isReal = label === "REAL"
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${
            isReal
                ? "bg-green-900/40 text-green-400 border-green-700"
                : "bg-red-900/40 text-red-400 border-red-700"
        }`}>
            <span className={`w-2 h-2 rounded-full ${isReal ? "bg-green-400" : "bg-red-400"}`} />
            {label}
        </span>
    )
}

// ConfidenceMeter.jsx
export function ConfidenceMeter({ confidence, label }) {
    const isReal = label === "REAL"
    const color  = isReal ? "bg-green-500" : "bg-red-500"

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Confidence</span>
                <span className={`text-sm font-bold ${isReal ? "text-green-400" : "text-red-400"}`}>
                    {confidence}%
                </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${confidence}%` }}
                />
            </div>
        </div>
    )
}

// WordHighlighter.jsx
export function WordHighlighter({ text, keywords, label }) {
    if (!keywords || keywords.length === 0) return <p className="text-gray-300 text-sm">{text}</p>

    const isReal    = label === "REAL"
    const color     = isReal ? "bg-green-900/60 text-green-300" : "bg-red-900/60 text-red-300"
    const words     = text.split(" ")

    return (
        <p className="text-gray-300 text-sm leading-relaxed">
            {words.map((word, i) => {
                const clean      = word.toLowerCase().replace(/[^a-z]/g, "")
                const isKeyword  = keywords.some(k => clean.includes(k) || k.includes(clean))
                return (
                    <span key={i}>
                        <span className={isKeyword ? `px-0.5 rounded ${color}` : ""}>
                            {word}
                        </span>{" "}
                    </span>
                )
            })}
        </p>
    )
}