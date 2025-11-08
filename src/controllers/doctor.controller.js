// @ts-ignore
import bcrypt from 'bcryptjs';
import { createNewDoctor, getDoctorByCreds } from "../model/doctoer.model.js";

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

        if (!doctor) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const passwordMatch = await bcrypt.compare(password, doctor.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        return res.status(200).json({
            id: doctor.id,
            name: doctor.name,
            email: doctor.email,
            role: doctor.role
        });
    } catch (error) {
        next(error);
    }
};
