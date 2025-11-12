import { Status } from "../../generated/prisma/index.js";

export const getAllStatus = async (req, res, next) => {
    try {
        const statusList = Object.values(Status);
        return res.json({ data: statusList });
    } catch (error) {
        next(error);
    }
}