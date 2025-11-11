import prisma from '../../prisma.setup.js'

export const getAllPatientsData = async () => {
  try {
    return await prisma.patient.findMany();
  } catch (err) {
    throw err;
  }
};


export const getPatientDataWithId=async(id)=>{
  try {
    return await prisma.patient.findUnique({
      where:{
        patientId:id
      }
    })
  } catch (error) {
    throw error;
  }
}

export const createNewPatient = async (payload) => {
  try {
    return await prisma.patient.create({
      data: payload,
      select: {
        id: true,
        patientId: true,
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