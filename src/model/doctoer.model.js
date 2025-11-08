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
            },
        });
    } catch (err) {
        console.log({ error: err });
        throw err;
    }
};

export const updateDoctorById = async (payload) => {
    try {
        return await prisma.doctor.update({
            where: { id: payload.userId },
            data: { email: payload.email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
    } catch (err) {
        console.log({ error: err });
        throw err;
    }
};

