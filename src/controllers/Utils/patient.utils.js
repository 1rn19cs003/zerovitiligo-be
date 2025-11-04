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


export const patientValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),

  address: Yup.string()
    .min(5, 'Address is too short')
    .max(200, 'Address is too long')
    .required('Address is required'),

  age: Yup.number()
    .typeError('Age must be a number')
    .required('Age is required')
    .integer('Age must be a whole number')
    .min(1, 'Age must be 1 or older')
    .max(120, 'Age is unrealistic'),

  bodyWeight: Yup.number()
    .typeError('Body Weight must be a number')
    .required('Body Weight is required')
    .min(1, 'Weight must be positive')
    .max(500, 'Weight is too high'),

  vitiligoDuration: Yup.number()
    .typeError('Duration must be a number')
    .required('Duration is required')
    .min(1, 'Duration must be positive'),

  currentMedicine: Yup.string()
    .required('Please indicate if you are taking medicine'),

  familyHistory: Yup.string()
    .required('Please indicate family history status'),

  covidVaccine: Yup.string()
    .required('Please indicate COVID vaccine status'),

  vaccineDoses: Yup.string()
    .when('covidVaccine', {
      is: 'yes',
      then: (schema) => schema.required('Number of doses is required if vaccine was taken'),
      otherwise: (schema) => schema.notRequired(),
    }),
  otherDisease: Yup.string()
    .max(500, 'Details are too long')
    .notRequired(),
});