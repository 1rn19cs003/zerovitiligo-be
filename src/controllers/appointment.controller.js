import { AppointmentStatus } from "../../generated/prisma/index.js";
import { getAppointmentsByDoc, getAppointmentsByPat, newAppointment, updateAppointment, getAppointmentDataWithId, rescheduleAppointmentWithID } from "../model/appointment.model.js";

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

        const scheduledAppointments = await getAppointmentsByPat({ patientId: undefined, Id: patientId, appointmentStatus: AppointmentStatus.SCHEDULED });
        if (scheduledAppointments && scheduledAppointments.length > 0) {
            return res.status(400).json({
                success: true,
                message: 'Patient already has a scheduled appointment. Please complete or cancel existing appointment before creating a new one.',
            });
        }

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
                message: 'doctorId is required',
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
                message: 'patientId is required',
            });
        }
        const appointments = await getAppointmentsByPat({
            patientId,
            Id: undefined,
            appointmentStatus: undefined
        });
        return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        next(error);
    }
};

export const updateAppointmentByAppointmentId = async (req, res, next) => {
    try {
        const { appointmentId } = req.query;
        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: 'appointmentId is required',
            });
        }

        const {
            reason,
            medication,
            status,
            notes,
        } = req.body;

        const payload = {
            reason,
            medication,
            status,
            notes,
        };
        const updatedAppomintment = await updateAppointment(appointmentId, payload)
        return res.status(200).json({ success: true, data: updatedAppomintment });

    } catch (error) {
        next(error);
    }
}

export const rescheduleAppointment = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;
        const { appointmentDate } = req.body;
        const appointment = await getAppointmentDataWithId(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }
        const payload = {
            appointmentDate: appointmentDate ? new Date(appointmentDate) : new Date(),
            status: AppointmentStatus.SCHEDULED
        }
        const rescheduledAppointment = await rescheduleAppointmentWithID(appointment.id, payload);
        return res.status(200).json({
            success: true,
            data: rescheduledAppointment,
            message: 'Appointment rescheduled successfully',
        });
    } catch (error) {
        next(error);
    }
}