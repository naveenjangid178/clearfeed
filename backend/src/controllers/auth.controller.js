import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

const generateToken = (userId) => {
    return jwt.sign(
        { _id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}

// ── Register ──────────────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters")
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword
    })

    // Generate token
    const token = generateToken(user._id)

    // Return user without password
    const createdUser = await User.findById(user._id).select("-password")

    return res
        .status(201)
        .cookie("token", token, cookieOptions)
        .json(new ApiResponse(201, { user: createdUser, token }, "User registered successfully"))
})

// ── Login ─────────────────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required")
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
        throw new ApiError(404, "No account found with this email")
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    // Generate token
    const token = generateToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")

    return res
        .status(200)
        .cookie("token", token, cookieOptions)
        .json(new ApiResponse(200, { user: loggedInUser, token }, "Logged in successfully"))
})

// ── Logout ────────────────────────────────────────────────────────
const logoutUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .clearCookie("token", cookieOptions)
        .json(new ApiResponse(200, {}, "Logged out successfully"))
})

// ── Get Current User ──────────────────────────────────────────────
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched successfully"))
})

// ── Change Password ───────────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old and new password are required")
    }

    if (newPassword.length < 8) {
        throw new ApiError(400, "New password must be at least 8 characters")
    }

    // Get user with password
    const user = await User.findById(req.user._id)

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Old password is incorrect")
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

// ── Update Account Details ────────────────────────────────────────
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name, email } = req.body

    if (!name && !email) {
        throw new ApiError(400, "At least one field is required to update")
    }

    // Check if new email is already taken
    if (email) {
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
            _id: { $ne: req.user._id }
        })
        if (existingUser) {
            throw new ApiError(409, "Email is already in use")
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                ...(name  && { name }),
                ...(email && { email: email.toLowerCase() })
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Account updated successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword,
    updateAccountDetails
}