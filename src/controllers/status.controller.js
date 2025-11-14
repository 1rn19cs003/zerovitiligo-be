import { Status, AppointmentStatus } from "../../generated/prisma/index.js";

export const getAllStatus = async (req, res, next) => {
    try {
        const statusList = Object.values(Status);
        return res.status(200).json({
            success: true,
            data: statusList,
        });
    } catch (error) {
        next(error);
    }
}

export const getAllAppointmentStatus = async (req, res, next) => {
    try {
        const statusList = Object.values(AppointmentStatus);
        return res.status(200).json({
            success: true,
            data: statusList,
        });
    } catch (error) {
        next(error);
    }
}