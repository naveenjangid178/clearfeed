import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    predictionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prediction',
        required: [true, "Prediction ID is required"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"]
    },
    correctLabel: {
        type: String,
        enum: ['FAKE', 'REAL'],
        required: [true, "Correct label is required"]
    },
    comment: {
        type: String,
        maxlength: [500, "Comment cannot exceed 500 characters"],
        default: null
    }
}, { timestamps: true })

export const Feedback = mongoose.model("Feedback", feedbackSchema)