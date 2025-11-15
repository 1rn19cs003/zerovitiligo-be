import prisma from '../../prisma.setup.js'


export const newAppointment = async (payload) => {
    try {
        return await prisma.appointment.create({
            data: payload,
        });
    } catch (err) {
        console.log({ eoor: err })
        throw err;
    }
};

export const getAppointmentsByDoc = async (id) => {
    try {
        return await prisma.appointment.findMany({
            where: { doctorId: id },
            include: { patient: true }
        });
    } catch (err) {
        console.log({ eoor: err })
        throw err;
    }
};

export const getAppointmentsByPat = async ({ patientId, Id, appointmentStatus }) => {
    try {
        const where = {};
        if (patientId) {
            where.patient = { patientId };
        }
        if (Id) {
            where.patientId = Id;
        }
        if (appointmentStatus) {
            where.status = appointmentStatus;
        }
        return await prisma.appointment.findMany({ where });
    } catch (err) {
        console.log({ error: err });
        throw err;
    }
};

