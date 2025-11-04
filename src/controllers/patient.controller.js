import { createNewPatient, getAllPatientsData } from "../model/patient.model.js";
import { generatePatientId, patientValidationSchema } from "./Utils/patient.utils.js";

export const getAllPatients = async (req, res, next) => {
    try {
        const response = await getAllPatientsData();
        return res.status(200).json({
            data: response
        })
    } catch (error) {
        next(error);
    }
}

export const createPatient = async (req, res, next) => {
    try {

        const validationErrors = await patientValidationSchema.validate(req.body, { abortEarly: true });
        if (validationErrors.errors) {
            return res.status(400).json({
                data: validationErrors.errors
            })
        }
        const {
            name,
            age,
            bodyWeight,
            address,
            vitiligoDuration,
            currentMedicine,
            covidVaccine,
            vaccineDoses,
            otherDisease,
            familyHistory
        } = req.body;
        const dataToSave = {
            patentId: generatePatientId(),
            name: name,
            age: parseInt(age),
            address: address || null,
            vitiligoDuration: vitiligoDuration.toString() + ' Years',
            currentMedicine: currentMedicine,
            familyHistory: familyHistory,
            covidVaccine: covidVaccine,
            otherDisease: otherDisease || null,
            bodyWeight: bodyWeight ? parseFloat(bodyWeight) : null,
            vaccineDoses: (covidVaccine === 'yes' && vaccineDoses)
                ? parseInt(vaccineDoses.split(' ')[0])
                : null,
        };
        const response = await createNewPatient(dataToSave);
        return res.status(200).json({
            data: response
        })
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: `Patient ID conflict. Please try submission again.`,
            });
        }
        next(error);
    }
}