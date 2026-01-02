import prisma from '../prisma.setup.js';
import bcrypt from 'bcryptjs';
// Utility to generate dummy patient data
function generatePatientData(count) {
    const basePatients = [
        {
            patientId: "ZVG2601020016",
            name: "Siddharth Kumar",
            age: 35,
            mobile: "6386549132",
            bodyWeight: 65,
            address: "12 MG Road, Delhi",
            state: "Delhi",
            vitiligoDuration: "3 years",
            currentMedicine: "Vitamin D",
            vaccineDoses: "2",
            hasDisease: "No",
            diseaseDetails: "",
            familyHistory: "None",
            status: "NEW_REGISTRATION",
            doctorId: null,
            assistantId: null,
        }
    ];


    // Repeat or slice array based on requested count
    const result = [];
    for (let i = 16; i < count; i++) {
        const base = basePatients[i % basePatients.length];
        // Generate unique patientId and mobile by appending index
        result.push({
            ...base,
            patientId: `${base.patientId}${i + 1}`,
            mobile: (parseInt(base.mobile) + i).toString(),
        });
    }
    return result;
}

// Seed patients
async function seedPatients(count) {
    const patients = generatePatientData(count);
    await prisma.patient.createMany({
        data: patients,
        skipDuplicates: true,
    });
    console.log(`Seeded ${count} patients.`);
}

// Assuming you have a Doctor model in Prisma schema like:
// model Doctor {
//   id         Int    @id @default(autoincrement())
//   doctorId   String @unique
//   name       String
//   email      String @unique
//   role       String
//   createdAt  DateTime @default(now())
// }

// Example seed function for Admin doctors
async function seedDoctorTableWithADMIN() {
    const admins = [
        {
            name: 'Admin User One',
            email: 'admin@gmail.com',
            role: 'ADMIN',
            password: await bcrypt.hash('admin', 10),
        }
    ];

    await prisma.doctor.createMany({
        data: admins,
        skipDuplicates: true, // skips duplicates to avoid errors on reruns
    });
    console.log(`Seeded ${admins.length} admin doctors.`);
}

// Main seed function
async function main() {
    await seedPatients(90);       // Seed 10 patient rows
    // await seedDoctorTableWithADMIN();   // Example: seed 5 rows for other table
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
