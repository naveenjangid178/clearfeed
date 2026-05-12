import { Router } from "express"
import {
    getHistory,
    getHistoryById,
    deletePrediction,
    clearHistory
} from "../controllers/history.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

// All history routes are protected
router.use(verifyJWT)

router.get("/",        getHistory)         // GET  /api/v1/history
router.get("/:id",     getHistoryById)     // GET  /api/v1/history/:id
router.delete("/",     clearHistory)       // DELETE /api/v1/history
router.delete("/:id",  deletePrediction)   // DELETE /api/v1/history/:id

export default router