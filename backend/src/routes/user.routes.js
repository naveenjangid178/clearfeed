import { Router } from "express"
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword,
    updateAccountDetails
} from "../controllers/auth.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

// Public routes — no auth needed
router.post("/register", registerUser)
router.post("/login", loginUser)

// Protected routes — must be logged in
router.post("/logout", verifyJWT, logoutUser)
router.get("/me", verifyJWT, getCurrentUser)
router.patch("/change-password", verifyJWT, changePassword)
router.patch("/update", verifyJWT, updateAccountDetails)

export default router