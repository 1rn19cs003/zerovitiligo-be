import { AppointmentStatus } from "../../generated/prisma/index.js";
import prisma from '../../prisma.setup.js'

export const getAllPatientsData = async () => {
  try {
    return await prisma.patient.findMany({
      include: {
        Appointment: {
          where: {
            status: AppointmentStatus.SCHEDULED,
          },
          select: {
            status:true,
            createdAt: true,
            appointmentDate: true,
          }
        }
      }
    });
  } catch (err) {
    throw err;
  }
};


export const getPatientDataWithId = async (id) => {
  try {
    return await prisma.patient.findUnique({
      where: {
        patientId: id
      },
      include: {
        Appointment: {
          select: {
            status: true
          }
        }
      }
    })
  } catch (error) {
    throw error;
  }
}

export const updatePatientWithID = async (id, payload) => {
  try {
    return await prisma.patient.update({
      where: {
        patientId: id
      },
      data: payload
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
    console.log({ eoor: err })
    throw err;
  }
};

export const deletePatientWithID = async (id) => {
  try {
    return await prisma.patient.delete({
      where: {
        patientId: id
      }
    })
  } catch (error) {
    throw error;
  }
}
