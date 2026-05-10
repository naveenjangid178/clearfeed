import { Router } from "express"

const router = Router()

router.post("/analyze")
router.post("/analyze-url")
router.get("/:id")

export default router