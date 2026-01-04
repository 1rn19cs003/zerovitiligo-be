import { createNewPatient, deletePatientWithID, getAllPatientsData, getPatientDataWithId, updatePatientWithID } from "../model/patient.model.js";
import { generatePatientId, patientValidationSchema } from "../utils/patient.utils.js";
import { Gender } from "../../generated/prisma/index.js";

export const getAllPatients = async (req, res, next) => {
    try {
        const response = await getAllPatientsData();
        const formattedResponse = response.map(data => ({
            id: data.patientId || 'N/A',
            name: data.name || 'N/A',
            age: data.age || 'N/A',
            mobile: data.mobile || 'N/A',
            address: data.address || 'N/A',
            state: data.state || 'N/A',
            status: data.status || 'N/A',
            createdAt: data.createdAt || 'N/A',
            gender: data.gender || 'N/A',
            appointmentData: data?.Appointment
        }));

        return res.status(200).json({ data: formattedResponse });
    } catch (error) {
        next(error);
    }
}

export const getPatient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const patient = await getPatientDataWithId(id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }
        return res.status(200).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        next(error);
    }
}
export const updatePatient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existingPatient = await getPatientDataWithId(id);
        if (!existingPatient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }

        const {
            name,
            age,
            mobile,
            bodyWeight,
            address,
            state,
            vitiligoDuration,
            currentMedicine,
            vaccineDoses,
            hasDisease,
            diseaseDetails,
            familyHistory,
            status,
            gender,
        } = req.body;

        const updateData = {
            name,
            age: parseInt(age),
            bodyWeight: parseFloat(bodyWeight),
            address,
            mobile,
            state,
            vitiligoDuration,
            currentMedicine,
            vaccineDoses,
            hasDisease,
            diseaseDetails,
            familyHistory,
            status,
            gender,
        }

        const updatedPatient = await updatePatientWithID(id, updateData);
        return res.status(200).json({
            success: true,
            data: updatedPatient,
            message: 'Patient updated successfully',
        });
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
            mobile,
            vitiligoDuration,
            currentMedicine,
            vaccineDoses,
            familyHistory,
            state,
            hasDisease,
            diseaseDetails,
            status,
            gender,
        } = req.body;


        // Prepare data to save
        const dataToSave = {
            patientId: generatePatientId(),
            name: name,
            age: parseInt(age),
            state: state,
            mobile: mobile,
            vitiligoDuration: vitiligoDuration.toString() + " Years",
            currentMedicine: currentMedicine,
            familyHistory: familyHistory,
            hasDisease: hasDisease === "Yes" ? hasDisease : "No",
            bodyWeight: bodyWeight ? parseFloat(bodyWeight) : null,
            diseaseDetails: hasDisease === "Yes" ? diseaseDetails || null : null,
            vaccineDoses: vaccineDoses,
            gender: gender ? gender.toUpperCase() : Gender.OTHER,
            status: status,
        };

        // Save data to db
        const response = await createNewPatient(dataToSave);
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
}

export const deletePatient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const patient = await getPatientDataWithId(id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }
        const deletedPatient = await deletePatientWithID(patient.id);
        return res.status(200).json({
            success: true,
            data: deletedPatient,
            message: 'Patient deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

export const updatePatientStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const patient = await getPatientDataWithId(id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found',
            });
        }
        const updatedPatient = await updatePatientWithID(patient.patientId, { status: req.body.status });
        return res.status(200).json({
            success: true,
            data: updatedPatient,
            message: 'Patient status updated successfully',
        });
    } catch (error) {
        next(error);
    }
}
