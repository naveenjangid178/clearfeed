import { Router } from "express"
import {
    submitFeedback,
    getUserFeedback,
    updateFeedback,
    deleteFeedback
} from "../controllers/feedback.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

// All feedback routes are protected
router.use(verifyJWT)

router.post("/",      submitFeedback)   // POST   /api/v1/feedback
router.get("/",       getUserFeedback)  // GET    /api/v1/feedback
router.patch("/:id",  updateFeedback)   // PATCH  /api/v1/feedback/:id
router.delete("/:id", deleteFeedback)   // DELETE /api/v1/feedback/:id

export default router