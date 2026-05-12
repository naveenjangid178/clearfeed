import { Router } from "express"
import { getAnalytics } from "../controllers/analytics.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

// All analytics routes are protected
router.use(verifyJWT)

router.get("/", getAnalytics)   // GET /api/v1/analytics

export default router