import prisma from '../prisma.setup.js';

// Utility to generate dummy patient data
function generatePatientData(count) {
    const basePatients = [
        {
            patientId: "ZVG20",
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
    for (let i = 60; i < count; i++) {
        const base = basePatients[i % basePatients.length];
        // Generate unique patientId and mobile by appending index
        result.push({
            ...base,
            patientId: `${base.patientId}_${i + 1}`,
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

// Placeholder function for another table
// async function seedOtherTable(count) {
//   // TODO: adjust for your other models
//   console.log(`Seeding other table with ${count} rows - implement as needed.`);
// }

// Main seed function
async function main() {
    await seedPatients(90);       // Seed 10 patient rows
    //   await seedOtherTable(5);      // Example: seed 5 rows for other table
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
