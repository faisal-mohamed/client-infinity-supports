// Debug script to analyze missing fields in Client Intake Form
// Run this to identify which fields are missing from the form view vs PDF

const expectedFieldsFromPDF = [
  // Personal Information
  'ndisNumber', 'givenName', 'surname', 'preferredName', 'dateOfBirth', 'sex', 'pronoun', 'aboriginalTorres',
  'addressNumberStreet', 'state', 'postcode', 'email', 'homePhone', 'mobile', 'disabilityConditions',
  
  // Medical Contact
  'medicalCentreName', 'medicalPhone',
  
  // Support Coordinator
  'supportCoordinatorName', 'supportCoordinatorEmail', 'supportCoordinatorCompany', 'supportCoordinatorContact', 'otherSupports',
  
  // About Me
  'aboutMe',
  
  // Advocate Details
  'advocateName', 'advocateEmail', 'advocatePhone', 'advocateMobile', 'advocateAddress', 'advocatePostalAddress', 
  'advocateOtherInfo', 'advocateRelationship',
  
  // Cultural Information
  'barriers', 'language', 'interpreter', 'countryOfBirth', 'culturalValues', 'culturalBehaviours', 'writtenCommunication',
  
  // Contact Details
  'primaryContactName', 'primaryContactRelationship', 'primaryContactHomePhone', 'primaryContactMobile',
  'secondaryContactName', 'secondaryContactRelationship', 'secondaryContactHomePhone', 'secondaryContactMobile',
  
  // Living Arrangements
  'livingArrangements', 'livingArrangementsOther', 'travelArrangements', 'travelArrangementsOther',
  
  // Medical Information (Yes/No + Details)
  'medicationChart', 'medicationChartOthers',
  'mealtimeManagement', 'mealtimeManagementOthers',
  'bowelCare', 'bowelCareOthers',
  'menstrualIssues', 'menstrualIssuesOthers',
  'epilepsy', 'epilepsyOthers',
  'asthmatic', 'asthmaticOthers',
  'allergies', 'allergiesOthers',
  'anaphylactic', 'anaphylacticOthers',
  'minorInjury', 'minorInjuryOthers',
  'training', 'trainingOthers',
  'othermedical', 'othermedicalOthers',
  'trigger', 'triggerOthers',
  
  // Safety Considerations (Yes/No + Details)
  'absconding', 'abscondingOthers',
  'historyOfFalls', 'historyOfFallsOthers',
  'behaviourConcern', 'behaviourConcernOthers',
  'positiveBehaviour', 'positiveBehaviourOthers',
  'communicationAssistance', 'communicationAssistanceOthers',
  'physicalAssistance', 'physicalAssistanceOthers',
  'languageConcern', 'languageConcernOthers',
  'personalGoals', 'personalGoalsOthers'
];

const fieldsDefinedInFormSchema = [
  // From Page 1 (clientIntakeSchema)
  'date', 'ndisNumber', 'givenName', 'surname', 'sex', 'pronoun', 'aboriginalTorres', 'preferredName', 'dateOfBirth',
  'addressNumberStreet', 'state', 'postcode', 'email', 'homePhone', 'mobile', 'disabilityConditions',
  
  // From Page 2 (gpMedicalSupportSchema)
  'medicalCentreName', 'medicalPhone', 'supportCoordinatorName', 'supportCoordinatorEmail', 
  'supportCoordinatorCompany', 'supportCoordinatorContact', 'otherSupports',
  
  // From Page 3 (allAboutMeSchema)
  'aboutMe', 'advocateName', 'advocateRelationship', 'advocatePhone', 'advocateMobile', 'advocateEmail',
  'advocateAddress', 'advocatePostalAddress', 'advocateOtherInfo',
  'barriers', 'interpreter', 'language', 'culturalValues', 'culturalBehaviours', 'writtenCommunication', 'countryOfBirth',
  
  // From Page 4 (contactsLivingTravelSchema)
  'primaryContactName', 'primaryContactRelationship', 'primaryContactHomePhone', 'primaryContactMobile',
  'secondaryContactName', 'secondaryContactRelationship', 'secondaryContactHomePhone', 'secondaryContactMobile',
  'livingArrangements', 'livingArrangementsOther', 'travelArrangements', 'travelArrangementsOther',
  
  // From Page 5 (medicationInfoSchema) - Only main fields, not detail fields
  'medicationChart', 'mealtimeManagement', 'bowelCare', 'menstrualIssues', 'epilepsy', 'asthmatic', 
  'allergies', 'anaphylactic', 'minorInjury', 'training', 'othermedical', 'trigger',
  
  // From Page 6 (safetyConsiderationSchema) - Only main fields, not detail fields
  'absconding', 'historyOfFalls', 'behaviourConcern', 'positiveBehaviour', 'communicationAssistance',
  'physicalAssistance', 'languageConcern', 'personalGoals'
];

// Find missing fields
const missingFromFormSchema = expectedFieldsFromPDF.filter(field => !fieldsDefinedInFormSchema.includes(field));

console.log('=== MISSING FIELDS ANALYSIS ===');
console.log('');
console.log('Fields expected by PDF but missing from form schema:');
console.log(missingFromFormSchema);
console.log('');
console.log('Total missing fields:', missingFromFormSchema.length);
console.log('');

// Group missing fields by category
const missingByCategory = {
  'Medical Detail Fields': missingFromFormSchema.filter(f => f.includes('Others') && (f.includes('medication') || f.includes('epilepsy') || f.includes('asthmatic') || f.includes('allergies') || f.includes('anaphylactic') || f.includes('training') || f.includes('othermedical') || f.includes('trigger') || f.includes('mealtime') || f.includes('bowel') || f.includes('menstrual') || f.includes('minor'))),
  'Safety Detail Fields': missingFromFormSchema.filter(f => f.includes('Others') && (f.includes('absconding') || f.includes('Falls') || f.includes('behaviour') || f.includes('positive') || f.includes('communication') || f.includes('physical') || f.includes('language') || f.includes('personal'))),
  'Other Missing Fields': missingFromFormSchema.filter(f => !f.includes('Others'))
};

Object.entries(missingByCategory).forEach(([category, fields]) => {
  if (fields.length > 0) {
    console.log(`${category}:`);
    fields.forEach(field => console.log(`  - ${field}`));
    console.log('');
  }
});

console.log('=== ANALYSIS COMPLETE ===');
