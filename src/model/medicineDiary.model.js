import prisma from '../../prisma.setup.js'

/**
 * Create a new medicine diary entry
 * @param {Object} data - Medicine diary data
 * @returns {Promise<Object>} Created medicine diary entry
 */
export const createMedicineDiary = async (data) => {
    return await prisma.medicineDiary.create({
        data: {
            date: new Date(data.date),
            medicineCode: data.medicineCode,
            durationDays: parseInt(data.durationDays),
            price: parseFloat(data.price),
            comments: data.comments || null,
            patientId: data.patientId,
            createdBy: data.createdBy,
        },
        include: {
            patient: {
                select: {
                    name: true,
                    patientId: true,
                }
            },
            doctor: {
                select: {
                    name: true,
                    role: true,
                }
            }
        }
    });
};

/**
 * Get all medicine diary entries for a patient
 * @param {string} patientId - Patient ID
 * @returns {Promise<Array>} List of medicine diary entries
 */
export const getMedicineDiaryByPatientId = async (patientId) => {
    return await prisma.medicineDiary.findMany({
        where: {
            patientId: patientId,
        },
        include: {
            doctor: {
                select: {
                    name: true,
                    role: true,
                }
            }
        },
        orderBy: {
            date: 'desc',
        }
    });
};

/**
 * Delete a medicine diary entry
 * @param {string} id - Medicine diary entry ID
 * @returns {Promise<Object>} Deleted medicine diary entry
 */
export const deleteMedicineDiary = async (id) => {
    return await prisma.medicineDiary.delete({
        where: {
            id: id,
        }
    });
};

/**
 * Get a single medicine diary entry by ID
 * @param {string} id - Medicine diary entry ID
 * @returns {Promise<Object>} Medicine diary entry
 */
export const getMedicineDiaryById = async (id) => {
    return await prisma.medicineDiary.findUnique({
        where: {
            id: id,
        },
        include: {
            patient: {
                select: {
                    name: true,
                    patientId: true,
                }
            },
            doctor: {
                select: {
                    name: true,
                    role: true,
                }
            }
        }
    });
};
