import prisma from '../../prisma.setup.js'

export const getAllPatientsData = async () => {
  try {
    return await prisma.patient.findMany();
  } catch (err) {
    throw err;
  }
};

export const createNewPatient = async (payload) => {
  try {
    return await prisma.patient.create({
      data: payload,
      select: {
        id: true,
        patentId: true,
        name: true,
        createdAt: true,
        status: true
      }
    });
  } catch (err) {
    console.log({eoor:err})
    throw err;
  }
};