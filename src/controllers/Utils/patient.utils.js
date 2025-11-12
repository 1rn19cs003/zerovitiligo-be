// @ts-ignore
import * as Yup from 'yup';

let sequenceCounter = 0;
let currentDay = '';

export const generatePatientId = (date = new Date()) => {
  const yyyy = String(date.getFullYear()).slice(2, 4);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  const dayKey = `${yyyy}${mm}${dd}`;
  if (dayKey !== currentDay) {
    sequenceCounter = 0;
    currentDay = dayKey;
  }

  sequenceCounter++;
  const seq = String(sequenceCounter).padStart(3, '0');
  const random2 = String(Math.floor(10 + Math.random() * 90));

  return `ZVG${yyyy}${mm}${dd}${seq}${random2}`;
};


export const patientValidationSchema = Yup.object({
  // === Basic Details ===
  name: Yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  age: Yup.number()
    .typeError("Age must be a number")
    .required("Age is required")
    .min(1, "Age must be greater than 0")
    .max(120, "Age must be realistic (below 120)"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^\+?[0-9\s-]{10,15}$/, "Enter a valid mobile number"),

  // === Location Logic ===
  state: Yup.string().required("Please select your state"),

  // === Health Info ===
  bodyWeight: Yup.number()
    .typeError("Body weight must be a number")
    .required("Please enter your body weight")
    .min(1, "Weight must be realistic")
    .max(300, "Weight must be realistic")
    .required('Body weight is required'),
  vitiligoDuration: Yup.number()
    .typeError("Duration must be a number")
    .required("Please enter vitiligo duration")
    .min(0, "Duration cannot be negative")
    .max(100, "Duration seems too long"),

  currentMedicine: Yup.string().required("Please specify if you take medicine"),
  familyHistory: Yup.string().required("Please specify family history"),
  vaccineDoses: Yup.string().required("Please select number of doses"),

  // === Other Diseases ===
  hasDisease: Yup.string().nullable(),
  diseaseDetails: Yup.string().when("hasDisease", {
    is: "Yes",
    then: (schema) =>
      schema
        .trim()
        .max(100, "Please keep it concise (max 100 characters)")
        .nullable(),
    otherwise: (schema) => schema.nullable(),
  }),
});
