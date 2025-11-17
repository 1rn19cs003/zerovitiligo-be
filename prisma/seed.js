import prisma from '../prisma.setup.js';

// Utility to generate dummy patient data
function generatePatientData(count) {
    const basePatients = [
        {
            patientId: "P10001",
            name: "Siddharth Kumar",
            age: 35,
            mobile: "9123456780",
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
        },
        {
            patientId: "P10002",
            name: "Anjali Mehta",
            age: 28,
            mobile: "9123456781",
            bodyWeight: 56.2,
            address: "221B Baker Street, Mumbai",
            state: "Maharashtra",
            vitiligoDuration: "1 year",
            currentMedicine: "Steroids",
            vaccineDoses: "1",
            hasDisease: "Yes",
            diseaseDetails: "Diabetes",
            familyHistory: "Father affected",
            status: "NEW_REGISTRATION",
            doctorId: null,
            assistantId: null,
        },
        {
            patientId: "P10003",
            name: "Ruchi Patel",
            age: 42,
            mobile: "9123456782",
            bodyWeight: 70,
            address: "Somewhere, Gujarat",
            state: "Gujarat",
            vitiligoDuration: "5 months",
            currentMedicine: "Immunosuppressants",
            vaccineDoses: "3",
            hasDisease: "No",
            diseaseDetails: "",
            familyHistory: "None",
            status: "NEW_REGISTRATION",
            doctorId: null,
            assistantId: null,
        },
        {
            patientId: "P10004",
            name: "Rahul Verma",
            age: 50,
            mobile: "9123456783",
            bodyWeight: 78.5,
            address: "Sector 22, Chandigarh",
            state: "Punjab",
            vitiligoDuration: "2 years",
            currentMedicine: "Topical ointments",
            vaccineDoses: "2",
            hasDisease: "Yes",
            diseaseDetails: "Hypothyroidism",
            familyHistory: "Mother and aunt affected",
            status: "NEW_REGISTRATION",
            doctorId: null,
            assistantId: null,
        },
        {
            patientId: "P10005",
            name: "Deepa Singh",
            age: 39,
            mobile: "9123456784",
            bodyWeight: 60,
            address: "45 Park Avenue, Kolkata",
            state: "West Bengal",
            vitiligoDuration: "18 months",
            currentMedicine: "Phototherapy",
            vaccineDoses: "2",
            hasDisease: "No",
            diseaseDetails: "",
            familyHistory: "None",
            status: "UNDER_TREATMENT",
            doctorId: null,
            assistantId: null,
        },
        {
            patientId: "P10006",
            name: "Manish Gupta",
            age: 45,
            mobile: "9123456785",
            bodyWeight: 75,
            address: "88 MG Road, Bangalore",
            state: "Karnataka",
            vitiligoDuration: "4 years",
            currentMedicine: "Corticosteroids",
            vaccineDoses: "3",
            hasDisease: "Yes",
            diseaseDetails: "Hypertension",
            familyHistory: "Father and uncle",
            status: "UNDER_TREATMENT",
            doctorId: null,
            assistantId: null,
        },
        {
            patientId: "P10007",
            name: "Nisha Sharma",
            age: 32,
            mobile: "9123456786",
            bodyWeight: 58,
            address: "12 Brigade Road, Pune",
            state: "Maharashtra",
            vitiligoDuration: "7 months",
            currentMedicine: "Immunomodulators",
            vaccineDoses: "2",
            hasDisease: "No",
            diseaseDetails: "",
            familyHistory: "None",
            status: "FOLLOW_UP",
            doctorId: null,
            assistantId: null,
        },
        {
            patientId: "P10008",
            name: "Rakesh Joshi",
            age: 55,
            mobile: "9123456787",
            bodyWeight: 80,
            address: "Sector 5, Noida",
            state: "Uttar Pradesh",
            vitiligoDuration: "5 years",
            currentMedicine: "Topical steroids",
            vaccineDoses: "3",
            hasDisease: "Yes",
            diseaseDetails: "Diabetes and Hypertension",
            familyHistory: "Mother and brother",
            status: "TREATMENT_COMPLETED",
            doctorId: null,
            assistantId: null,
        },
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
