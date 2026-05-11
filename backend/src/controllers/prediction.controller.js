import { Prediction } from "../models/prediction.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mlService from "../services/mlService.js"

// ── Analyze Text ──────────────────────────────────────────────────
const analyzeText = asyncHandler(async (req, res) => {
    const { text } = req.body

    // Validation
    if (!text || text.trim().length < 20) {
        throw new ApiError(400, "Please provide a full article (at least 20 characters)")
    }

    // Call Python ML service
    let mlResult
    try {
        mlResult = await mlService.analyzeText(text)
    } catch (error) {
        throw new ApiError(503, "ML service is unavailable. Make sure Python FastAPI is running.")
    }

    // Save prediction to MongoDB
    const prediction = await Prediction.create({
        userId      : req.user._id,
        text        : text.trim(),
        sourceUrl   : null,
        label       : mlResult.label,
        confidence  : mlResult.confidence,
        topKeywords : mlResult.top_keywords,
        modelUsed   : "RandomForest"
    })

    return res
        .status(201)
        .json(new ApiResponse(201, prediction, "Article analyzed successfully"))
})

// ── Analyze URL ───────────────────────────────────────────────────
const analyzeUrl = asyncHandler(async (req, res) => {
    const { url } = req.body

    // Validation
    if (!url || url.trim() === "") {
        throw new ApiError(400, "Please provide a valid URL")
    }

    // Basic URL format check
    try {
        new URL(url)
    } catch {
        throw new ApiError(400, "Invalid URL format")
    }

    // Call Python ML service
    let mlResult
    try {
        mlResult = await mlService.analyzeUrl(url)
    } catch (error) {
        if (error.response?.status === 400) {
            throw new ApiError(400, "Could not extract text from this URL. Try pasting the article directly.")
        }
        throw new ApiError(503, "ML service is unavailable. Make sure Python FastAPI is running.")
    }

    // Save prediction to MongoDB
    const prediction = await Prediction.create({
        userId      : req.user._id,
        text        : url,
        sourceUrl   : url,
        label       : mlResult.label,
        confidence  : mlResult.confidence,
        topKeywords : mlResult.top_keywords,
        modelUsed   : "RandomForest"
    })

    return res
        .status(201)
        .json(new ApiResponse(201, prediction, "URL analyzed successfully"))
})

// ── Get Single Prediction ─────────────────────────────────────────
const getPrediction = asyncHandler(async (req, res) => {
    const { id } = req.params

    const prediction = await Prediction.findById(id)

    if (!prediction) {
        throw new ApiError(404, "Prediction not found")
    }

    // Make sure user can only access their own predictions
    if (prediction.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to view this prediction")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, prediction, "Prediction fetched successfully"))
})

export {
    analyzeText,
    analyzeUrl,
    getPrediction
}