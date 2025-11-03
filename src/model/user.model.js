import prisma from '../../prisma.setup.js'

export const getAllUsersData = async () => {
  try {
    return await prisma.doctor.findMany();
  } catch (err) {
    throw err;
  }
};
