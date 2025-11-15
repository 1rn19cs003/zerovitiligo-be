import { getAppointmentsByDoc, getAppointmentsByPat, newAppointment } from "../model/appointment.model.js";

export const createAppointment = async (req, res, next) => {
    try {
        const {
            doctorId,
            patientId,
            appointmentDate,
            startTime,
            endTime,
            reason,
            medication,
            status,
            notes,
        } = req.body;

        const reqObj = {
            doctorId,
            patientId,
            appointmentDate: appointmentDate ? new Date(appointmentDate) : new Date(),
            startTime: startTime ? new Date(startTime) : new Date(),
            endTime: endTime ? new Date(endTime) : null,
            reason: reason || '',
            medication: medication || '',
            status,
            notes,
        };

        const appResponse = await newAppointment(reqObj);
        return res.status(201).json({ success: true, data: appResponse });
    } catch (error) {
        next(error);
    }
};

export const getAppointmentsByDoctor = async (req, res, next) => {
    try {
        const { doctorId } = req.query;
        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'doctorId query parameter is required',
            });
        }

        const appointments = await getAppointmentsByDoc(doctorId);

        return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        next(error);
    }
};

export const getAppointmentsByPatient = async (req, res, next) => {
    try {
        const { patientId } = req.query;
        if (!patientId) {
            return res.status(400).json({
                success: false,
                message: 'patient query parameter is required',
            });
        }

        const appointments = await getAppointmentsByPat(patientId);

        return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        next(error);
    }
};
