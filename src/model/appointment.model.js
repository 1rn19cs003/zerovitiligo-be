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

export const getAppointments = async (id) => {
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
