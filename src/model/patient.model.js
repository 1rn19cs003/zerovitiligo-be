import prisma from '../../prisma.setup.js'

export const getAllPatientsData = async () => {
  try {
    return await prisma.doctor.findMany();
  } catch (err) {
    throw err;
  }
};
