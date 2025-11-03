import { getAllPatientsData } from "../model/patient.model.js";
import { generatePatientId } from "./Utils/patient.utils.js";

export const getAllPatients = async (req, res, next) => {
    try {
        const data = generatePatientId()
        const response = getAllPatientsData();
        return res.status(200).json({
            data: data
        })
    } catch (error) {
        next(error);
    }
}
export const createPatient = async (req, res, next) => {
    try {
        const reqData = req.body;
        console.log(reqData);
        return res.status(200).json({
            data: reqData
        })
    } catch (error) {
        next(error);
    }
}