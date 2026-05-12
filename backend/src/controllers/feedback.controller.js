import { Feedback } from "../models/feedback.model.js"
import { Prediction } from "../models/prediction.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// ── Submit Feedback ───────────────────────────────────────────────
const submitFeedback = asyncHandler(async (req, res) => {
    const { predictionId, correctLabel, comment } = req.body

    // Validation
    if (!predictionId || !correctLabel) {
        throw new ApiError(400, "Prediction ID and correct label are required")
    }

    if (!["FAKE", "REAL"].includes(correctLabel)) {
        throw new ApiError(400, "Correct label must be FAKE or REAL")
    }

    // Check prediction exists
    const prediction = await Prediction.findById(predictionId)
    if (!prediction) {
        throw new ApiError(404, "Prediction not found")
    }

    // Make sure user can only submit feedback on their own predictions
    if (prediction.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to submit feedback on this prediction")
    }

    // Check if feedback already submitted for this prediction
    const existingFeedback = await Feedback.findOne({
        predictionId,
        userId: req.user._id
    })

    if (existingFeedback) {
        throw new ApiError(409, "You have already submitted feedback for this prediction")
    }

    // Save feedback
    const feedback = await Feedback.create({
        predictionId,
        userId      : req.user._id,
        correctLabel,
        comment     : comment?.trim() || null
    })

    return res
        .status(201)
        .json(new ApiResponse(201, feedback, "Feedback submitted successfully"))
})

// ── Get All Feedback by User ──────────────────────────────────────
const getUserFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({ userId: req.user._id })
        .populate("predictionId", "label confidence text createdAt")
        .sort({ createdAt: -1 })
        .select("-__v")

    return res
        .status(200)
        .json(new ApiResponse(200, {
            feedback,
            total: feedback.length
        }, "Feedback fetched successfully"))
})

// ── Update Feedback ───────────────────────────────────────────────
const updateFeedback = asyncHandler(async (req, res) => {
    const { correctLabel, comment } = req.body

    if (!correctLabel) {
        throw new ApiError(400, "Correct label is required")
    }

    if (!["FAKE", "REAL"].includes(correctLabel)) {
        throw new ApiError(400, "Correct label must be FAKE or REAL")
    }

    const feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
        throw new ApiError(404, "Feedback not found")
    }

    // Make sure user can only update their own feedback
    if (feedback.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this feedback")
    }

    feedback.correctLabel = correctLabel
    feedback.comment      = comment?.trim() || feedback.comment
    await feedback.save()

    return res
        .status(200)
        .json(new ApiResponse(200, feedback, "Feedback updated successfully"))
})

// ── Delete Feedback ───────────────────────────────────────────────
const deleteFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
        throw new ApiError(404, "Feedback not found")
    }

    // Make sure user can only delete their own feedback
    if (feedback.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this feedback")
    }

    await Feedback.findByIdAndDelete(req.params.id)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Feedback deleted successfully"))
})

export {
    submitFeedback,
    getUserFeedback,
    updateFeedback,
    deleteFeedback
}