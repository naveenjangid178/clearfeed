import { Prediction } from "../models/prediction.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// ── Get All History ───────────────────────────────────────────────
const getHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id

    // Pagination
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 10
    const skip  = (page - 1) * limit

    // Filtering by label
    const filter = { userId }
    if (req.query.label === "FAKE" || req.query.label === "REAL") {
        filter.label = req.query.label
    }

    // Sorting — newest first by default
    const sort = req.query.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 }

    // Fetch predictions + total count in parallel
    const [predictions, total] = await Promise.all([
        Prediction.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select("-__v"),
        Prediction.countDocuments(filter)
    ])

    return res.status(200).json(new ApiResponse(200, {
        predictions,
        pagination: {
            total,
            page,
            limit,
            totalPages : Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1
        }
    }, "History fetched successfully"))
})

// ── Get Single Prediction from History ────────────────────────────
const getHistoryById = asyncHandler(async (req, res) => {
    const prediction = await Prediction.findById(req.params.id)

    if (!prediction) {
        throw new ApiError(404, "Prediction not found")
    }

    if (prediction.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to view this prediction")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, prediction, "Prediction fetched successfully"))
})

// ── Delete Single Prediction ──────────────────────────────────────
const deletePrediction = asyncHandler(async (req, res) => {
    const prediction = await Prediction.findById(req.params.id)

    if (!prediction) {
        throw new ApiError(404, "Prediction not found")
    }

    // Make sure user can only delete their own predictions
    if (prediction.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this prediction")
    }

    await Prediction.findByIdAndDelete(req.params.id)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Prediction deleted successfully"))
})

// ── Clear All History ─────────────────────────────────────────────
const clearHistory = asyncHandler(async (req, res) => {
    const result = await Prediction.deleteMany({ userId: req.user._id })

    return res
        .status(200)
        .json(new ApiResponse(200, {
            deletedCount: result.deletedCount
        }, "History cleared successfully"))
})

export {
    getHistory,
    getHistoryById,
    deletePrediction,
    clearHistory
}