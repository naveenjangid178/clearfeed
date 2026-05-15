import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"]
    },
    text: {
        type: String,
        required: [true, "Article text is required"],
        minlength: [20, "Text too short to analyze"]
    },
    sourceUrl: {
        type: String,
        default: null
    },
    label: {
        type: String,
        enum: ['FAKE', 'REAL'],
        required: [true, "Label is required"]
    },
    confidence: {
        type: Number,
        required: [true, "Confidence score is required"],
        min: 0,
        max: 100
    },
    topKeywords: {
        type: [String],
        default: []
    },
    modelUsed: {
        type: String,
        default: 'RandomForest'
    }
}, { timestamps: true })

export const Prediction = mongoose.model("Prediction", predictionSchema)