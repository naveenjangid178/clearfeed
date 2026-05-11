import axios from "axios"

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000"

const mlService = {

    // ── Analyze text ──────────────────────────────────────────────
    analyzeText: async (text) => {
        const response = await axios.post(`${ML_SERVICE_URL}/api/predict`, {
            text
        })
        return response.data
    },

    // ── Analyze URL ───────────────────────────────────────────────
    analyzeUrl: async (url) => {
        const response = await axios.post(`${ML_SERVICE_URL}/api/predict-url`, {
            url
        })
        return response.data
    },

    // ── Get model info ────────────────────────────────────────────
    getModelInfo: async () => {
        const response = await axios.get(`${ML_SERVICE_URL}/api/models`)
        return response.data
    }

}

export default mlService