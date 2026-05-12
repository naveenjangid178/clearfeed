import { Prediction } from "../models/prediction.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// ── Get Full Analytics ────────────────────────────────────────────
const getAnalytics = asyncHandler(async (req, res) => {
    const userId = req.user._id

    // Run all queries in parallel for performance
    const [
        totalAnalyzed,
        fakeCount,
        realCount,
        recentActivity,
        keywordData
    ] = await Promise.all([

        // Total predictions
        Prediction.countDocuments({ userId }),

        // Fake count
        Prediction.countDocuments({ userId, label: "FAKE" }),

        // Real count
        Prediction.countDocuments({ userId, label: "REAL" }),

        // Last 7 predictions for recent activity
        Prediction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(7)
            .select("label confidence createdAt sourceUrl text"),

        // All keywords for word frequency analysis
        Prediction.find({ userId })
            .select("label topKeywords")
    ])

    // ── Keyword frequency analysis ────────────────────────────────
    const fakeKeywordMap = {}
    const realKeywordMap = {}

    keywordData.forEach(prediction => {
        const map = prediction.label === "FAKE" ? fakeKeywordMap : realKeywordMap
        prediction.topKeywords.forEach(keyword => {
            map[keyword] = (map[keyword] || 0) + 1
        })
    })

    // Sort and take top 10
    const topFakeKeywords = Object.entries(fakeKeywordMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }))

    const topRealKeywords = Object.entries(realKeywordMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }))

    // ── Daily activity for the last 7 days ────────────────────────
    const last7Days = await Prediction.aggregate([
        {
            $match: {
                userId,
                createdAt: {
                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                total: { $sum: 1 },
                fake : { $sum: { $cond: [{ $eq: ["$label", "FAKE"] }, 1, 0] } },
                real : { $sum: { $cond: [{ $eq: ["$label", "REAL"] }, 1, 0] } }
            }
        },
        { $sort: { _id: 1 } }
    ])

    // ── Confidence averages ───────────────────────────────────────
    const confidenceData = await Prediction.aggregate([
        { $match: { userId } },
        {
            $group: {
                _id                : "$label",
                avgConfidence      : { $avg: "$confidence" },
                highConfidenceCount: {
                    $sum: { $cond: [{ $gte: ["$confidence", 90] }, 1, 0] }
                }
            }
        }
    ])

    const fakeConfidence = confidenceData.find(d => d._id === "FAKE")
    const realConfidence = confidenceData.find(d => d._id === "REAL")

    return res.status(200).json(new ApiResponse(200, {
        // Overview
        overview: {
            totalAnalyzed,
            fakeCount,
            realCount,
            fakePercentage: totalAnalyzed > 0 ? Math.round((fakeCount / totalAnalyzed) * 100) : 0,
            realPercentage: totalAnalyzed > 0 ? Math.round((realCount / totalAnalyzed) * 100) : 0,
        },

        // Confidence
        confidence: {
            avgFakeConfidence: fakeConfidence ? Math.round(fakeConfidence.avgConfidence) : 0,
            avgRealConfidence: realConfidence ? Math.round(realConfidence.avgConfidence) : 0,
        },

        // Keywords
        keywords: {
            topFakeKeywords,
            topRealKeywords
        },

        // Charts data
        charts: {
            // Pie chart data
            pieChart: [
                { name: "Fake", value: fakeCount,  fill: "#EF4444" },
                { name: "Real", value: realCount,   fill: "#22C55E" }
            ],

            // Line chart — daily activity
            lineChart: last7Days
        },

        // Recent activity feed
        recentActivity
    }, "Analytics fetched successfully"))
})

export { getAnalytics }