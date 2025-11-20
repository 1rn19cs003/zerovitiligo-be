// @ts-ignore
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { createNewDoctor, getAllDocData, getDoctorByCreds, getDoctorById, updateDoctorById } from "../model/doctoer.model.js";

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || "7d";

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

    const accessToken = jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ id: doctor.id }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });

    // Set httpOnly, secure cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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
