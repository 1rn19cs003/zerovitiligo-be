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

        const validationResult = await patientValidationSchema.validate(req.body, { abortEarly: true });
        if (validationResult.errors) {
            return res.status(400).json({
                data: validationResult.errors
            })
        }
        const {
            name,
            age,
            bodyWeight,
            vitiligoDuration,
            currentMedicine,
            covidVaccine,
            vaccineDoses,
            familyHistory,
            fromIndia,
            state,
            country,
            hasDisease,
            diseaseDetails,
        } = req.body;

        let address = "";
        if (fromIndia === "Yes") {
            address = state ? `India, ${state}` : "India";
        } else if (fromIndia === "No") {
            address = country || null;
        }

        // Prepare data to save
        const dataToSave = {
            patientId: generatePatientId(),
            name: name,
            age: parseInt(age),
            address: address,
            vitiligoDuration: vitiligoDuration.toString() + " Years",
            currentMedicine: currentMedicine,
            familyHistory: familyHistory,
            covidVaccine: covidVaccine,
            fromIndia: fromIndia,
            hasDisease: hasDisease === "Yes" ? hasDisease : "No",
            bodyWeight: bodyWeight ? parseFloat(bodyWeight) : null,
            diseaseDetails: hasDisease === "Yes" ? diseaseDetails || null : null,
            vaccineDoses:
                covidVaccine === "yes" && vaccineDoses
                    ? vaccineDoses
                    : null,
        };

        // Save data to db
        const response = await createNewPatient(dataToSave);
        return res.status(200).json({ data: response });

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