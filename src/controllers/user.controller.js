import { getAllUsersData } from "../model/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const response = getAllUsersData();
        return res.status(200).json({
            data: response
        })
    } catch (error) {
        next(error);
    }
}