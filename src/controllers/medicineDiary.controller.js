import {
    createMedicineDiary,
    getMedicineDiaryByPatientId,
    deleteMedicineDiary,
    getMedicineDiaryById
} from "../model/medicineDiary.model.js";

/**
 * Create a new medicine diary entry
 */
export const createEntry = async (req, res, next) => {
    try {
        const { date, medicineCode, durationDays, price, comments, patientId } = req.body;
        const createdBy = req.user?.id;

        if (!createdBy) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated"
            });
        }

        // Validate required fields
        if (!date || !medicineCode || !durationDays || !price || !patientId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: date, medicineCode, durationDays, price, patientId"
            });
        }

        // Validate data types
        if (isNaN(durationDays) || parseInt(durationDays) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Duration must be a positive number"
            });
        }

        if (isNaN(price) || parseFloat(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a non-negative number"
            });
        }

        const entry = await createMedicineDiary({
            date,
            medicineCode,
            durationDays,
            price,
            comments,
            patientId,
            createdBy
        });

        return res.status(201).json({
            success: true,
            message: "Medicine diary entry created successfully",
            data: entry
        });
    } catch (error) {
        console.error("Error creating medicine diary entry:", error);
        next(error);
    }
};

/**
 * Get all medicine diary entries for a patient
 */
export const getEntriesByPatient = async (req, res, next) => {
    try {
        const { patientId } = req.params;

        if (!patientId) {
            return res.status(400).json({
                success: false,
                message: "Patient ID is required"
            });
        }

        const entries = await getMedicineDiaryByPatientId(patientId);

        return res.status(200).json({
            success: true,
            data: entries
        });
    } catch (error) {
        console.error("Error fetching medicine diary entries:", error);
        next(error);
    }
};

/**
 * Delete a medicine diary entry (Admin only)
 */
export const deleteEntry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userRole = req.user?.role;

        // Check if user is admin
        if (userRole !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Only admins can delete medicine diary entries"
            });
        }

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Entry ID is required"
            });
        }

        // Check if entry exists
        const entry = await getMedicineDiaryById(id);
        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Medicine diary entry not found"
            });
        }

        await deleteMedicineDiary(id);

        return res.status(200).json({
            success: true,
            message: "Medicine diary entry deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting medicine diary entry:", error);
        next(error);
    }
};
