import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    // Get token from cookie or Authorization header
    const token = req.cookies?.token ||
                  req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "Unauthorized — please log in")
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    // Find user
    const user = await User.findById(decodedToken._id).select("-password")
    if (!user) {
        throw new ApiError(401, "Invalid token — user not found")
    }

    req.user = user
    next()
})