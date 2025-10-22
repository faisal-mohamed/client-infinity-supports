// Debug script to compare medical fields in FormRenderer schema vs expected fields

const medicalFieldsInSchema = [
  'medicationChart',
  'mealtimeManagement', 
  'bowelCare',
  'menstrualIssues',
  'epilepsy',
  'asthmatic',
  'allergies',
  'anaphylactic',
  'minorInjury',
  'training',
  'othermedical',
  'trigger'
];

const expectedMedicalFields = [
  'medicationChart',
  'mealtimeManagement',
  'bowelCare', 
  'menstrualIssues',
  'epilepsy',
  'asthmatic',
  'allergies',
  'anaphylactic',
  'minorInjury',
  'training',
  'othermedical',
  'trigger'
];

const safetyFieldsInSchema = [
  'absconding',
  'historyOfFalls',
  'behaviourConcern',
  'positiveBehaviour',
  'communicationAssistance',
  'physicalAssistance',
  'languageConcern',
  'personalGoals'
];

const expectedSafetyFields = [
  'absconding',
  'historyOfFalls',
  'behaviourConcern',
  'positiveBehaviour',
  'communicationAssistance',
  'physicalAssistance',
  'languageConcern',
  'personalGoals'
];

console.log('=== MEDICAL FIELDS COMPARISON ===');
console.log('Fields in schema:', medicalFieldsInSchema.length);
console.log('Expected fields:', expectedMedicalFields.length);

const missingMedical = expectedMedicalFields.filter(f => !medicalFieldsInSchema.includes(f));
const extraMedical = medicalFieldsInSchema.filter(f => !expectedMedicalFields.includes(f));

console.log('Missing medical fields:', missingMedical);
console.log('Extra medical fields:', extraMedical);

console.log('\n=== SAFETY FIELDS COMPARISON ===');
console.log('Fields in schema:', safetyFieldsInSchema.length);
console.log('Expected fields:', expectedSafetyFields.length);

const missingSafety = expectedSafetyFields.filter(f => !safetyFieldsInSchema.includes(f));
const extraSafety = safetyFieldsInSchema.filter(f => !expectedSafetyFields.includes(f));

console.log('Missing safety fields:', missingSafety);
console.log('Extra safety fields:', extraSafety);

console.log('\n=== CONCLUSION ===');
if (missingMedical.length === 0 && missingSafety.length === 0) {
  console.log('✅ All main fields are present in the schema.');
  console.log('🔍 The issue is likely that the "Others" detail fields are not being saved/retrieved properly.');
  console.log('💡 Check the form submission process and database storage.');
} else {
  console.log('❌ Some main fields are missing from the schema.');
}
