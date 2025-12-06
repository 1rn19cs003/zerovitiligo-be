import prisma from '../../prisma.setup.js'

export const createNewDoctor = async (payload) => {
    try {
        return await prisma.doctor.create({
            data: payload,
            select: {
                id: true,
                name: true,
                role: true,
                email: true
            }
        });
    } catch (err) {
        console.log({ eoor: err })
        throw err;
    }
};

export const getDoctorByCreds = async (payload) => {
    try {
        return await prisma.doctor.findFirst({
            where: {
                email: payload.email,
                role: payload.role
            }
        });
    } catch (err) {
        console.log({ error: err });
        throw err;
    }
};

export const getDoctorById = async (userId) => {
    try {
        return await prisma.doctor.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                mobile: true,
            },
        });
    } catch (err) {
        console.log({ error: err });
        throw err;
    }
};

export const updateDoctorById = async (userId, email, payload) => {
    try {
        return await prisma.doctor.update({
            where: { id: userId, email: email },
            data: payload,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                mobile: true,
            },
        });
    } catch (err) {
        console.log({ error: err });
        throw err;
    }
};

export const getAllDocData = async () => {
    try {
        return await prisma.doctor.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                role: true
            }
        });
    } catch (err) {
        console.log({ error: err });
        throw err;
    }
};

export const deleteDoctorById = async (userId) => {
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                mobile: true,
            },
        });

        if (!doctor) {
            throw new Error('Doctor not found');
        }

        // Use a transaction to handle related records
        return await prisma.$transaction(async (prisma) => {
            // 1. Delete related Appointments
            await prisma.appointment.deleteMany({
                where: { doctorId: userId },
            });

            // 2. Delete related MedicineDiaries (created by this doctor)
            await prisma.medicineDiary.deleteMany({
                where: { createdBy: userId },
            });

            // 3. Update related Patients (set doctorId to null)
            await prisma.patient.updateMany({
                where: { doctorId: userId },
                data: { doctorId: null },
            });

            // 4. Delete the Doctor
            return await prisma.doctor.delete({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    mobile: true,
                },
            });
        });
    } catch (err) {
        console.log({ error: err });
        throw err;
    }
};
