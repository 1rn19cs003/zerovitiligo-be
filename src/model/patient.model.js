import { AppointmentStatus } from "../../generated/prisma/index.js";
import prisma from '../../prisma.setup.js'

export const getAllPatientsData = async () => {
  try {
    return await prisma.patient.findMany({
      include: {
        Appointment: {
          where: {
            status: {
              in: [AppointmentStatus.SCHEDULED, AppointmentStatus.COMPLETED]
            }
          },
          select: {
            status: true,
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
    return await prisma.patient.findFirst({
      where: {
        OR: [{ patientId: id }, { id: id }]
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

export const deletePatientWithID = async (uuid) => {
  try {
    // 1. Delete all related records first (to satisfy foreign key constraints)
    //    and then delete the patient.
    return await prisma.$transaction(async (tx) => {
      await tx.appointment.deleteMany({ where: { patientId: uuid } });
      await tx.medicineDiary.deleteMany({ where: { patientId: uuid } });
      await tx.image.deleteMany({ where: { patientId: uuid } });

      return await tx.patient.delete({
        where: { id: uuid }
      });
    });
  } catch (error) {
    throw error;
  }
}
