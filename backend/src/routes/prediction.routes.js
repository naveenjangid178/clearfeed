import { Router } from "express"
import {
    analyzeText,
    analyzeUrl,
    getPrediction
} from "../controllers/prediction.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

// All prediction routes are protected
router.use(verifyJWT)

router.post("/analyze",     analyzeText)
router.post("/analyze-url", analyzeUrl)
router.get("/:id",          getPrediction)

export default router