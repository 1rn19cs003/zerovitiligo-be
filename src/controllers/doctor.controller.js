// @ts-ignore
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { createNewDoctor, getAllDocData, getDoctorByCreds, getDoctorById, getDoctorPasswordById, updateDoctorById, deleteDoctorById } from "../model/doctor.model.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || "7d";
const isProd = process.env.NODE_ENV === "production";

if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error("ACCESS_SECRET and REFRESH_SECRET must be defined in environment variables");
}

export const createDoctor = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const dataToSave = {
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        };

        const response = await createNewDoctor(dataToSave);
        return res.status(200).json({ data: response });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: `Incorrect Details. Please try submission again.`,
            });
        }
        next(error);
    }
};

export const doctorLogin = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        const doctor = await getDoctorByCreds({ email, role });
        if (!doctor) return res.status(401).json({ message: "Invalid credentials" });

        const passwordMatch = await bcrypt.compare(password, doctor.password);
        if (!passwordMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        const payload = {
            id: doctor.id,
            email: doctor.email,
            role: doctor.role,
        };

        const accessToken = jwt.sign(
            payload,
            ACCESS_SECRET,
            { expiresIn: "15m" }
        );


        const refreshToken = jwt.sign({ id: doctor.id }, REFRESH_SECRET, {
            expiresIn: REFRESH_EXPIRES_IN,
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            user: {
                id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                role: doctor.role,
            },
            message: "Login successful",
        });
    } catch (error) {
        next(error);
    }
};

export const doctorLogout = async (req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Refresh access token using refresh token
 * This endpoint validates the refresh token and issues a new access token
 */
export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found",
                error: "No refresh token provided"
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        } catch (error) {
            return res.status(401).json({
                message: "Invalid or expired refresh token",
                error: error.message
            });
        }

        if (typeof decoded === 'string' || !decoded.id) {
            return res.status(401).json({
                message: "Invalid token payload "
            });
        }

        const doctor = await getDoctorById(decoded.id);
        if (!doctor) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const payload = {
            id: doctor.id,
            email: doctor.email,
            role: doctor.role,
        };

        const newAccessToken = jwt.sign(
            payload,
            ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Token refreshed successfully",
            user: {
                id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                role: doctor.role,
            }
        });
    } catch (error) {
        console.error("Token refresh error:", error);
        next(error);
    }
};


// Fetch profile for authenticated user
export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const response = await getDoctorById(userId)

        if (!response) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const getProfileById = async (req, res, next) => {
    try {
        const { profileId } = req.query;
        if (!profileId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const response = await getDoctorById(profileId)

        if (!response) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { email, phone } = req.body;

        const userObj = {
            mobile: phone
        }

        const response = await updateDoctorById(userId, email, userObj)

        return res.status(200).json({ success: true, data: response });
    } catch (error) {
        next(error);
    }
};

export const getAllDoctors = async (req, res, next) => {
    try {
        const response = await getAllDocData()
        if (!response) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        next(error);
    }
};

export const deleteDoctor = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { doctorId } = req.params;

        const response = await deleteDoctorById(doctorId);

        return res.status(200).json({ success: true, data: response });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, userId } = req.body;
        console.log({ re: req.body })
        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                error: 'Old password and new password are required'
            });
        }

        // Validate new password length
        if (newPassword.length < 8) {
            return res.status(400).json({
                error: 'New password must be at least 8 characters long'
            });
        }

        // Fetch current password hash
        const doctor = await getDoctorPasswordById(userId);
        if (!doctor) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify old password
        const passwordMatch = await bcrypt.compare(oldPassword, doctor.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Check if new password is different from old password
        const isSamePassword = await bcrypt.compare(newPassword, doctor.password);
        if (isSamePassword) {
            return res.status(400).json({
                error: 'New password must be different from current password'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        await updateDoctorById(userId, req.user.email, { password: hashedPassword });

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
};
