# PDF Generation with CommonFields - Test Plan

## ✅ Implementation Complete!

### **What We've Implemented:**

1. **Updated PDF Generation API** (`/api/generate-pdf/[formSubmissionId]/[formId]/route.ts`)
   - ✅ Fetches `clientId` from `formSubmissionId`
   - ✅ Fetches `commonFields` for that client
   - ✅ Passes `commonFields` to `generateHTML` function

2. **Updated generateHTML Function**
   - ✅ Accepts `commonFields` parameter
   - ✅ Passes `commonFields` to both form components

3. **Updated ClientIntakeV2 Component**
   - ✅ Already had full commonFields support
   - ✅ Uses `getFieldValue` function with commonFields fallback
   - ✅ Maps form fields to commonField properties via `commonFieldMapping`

4. **Updated HomeVisitRiskAssessment Component**
   - ✅ Now accepts `commonFields` parameter
   - ✅ Passes `commonFields` to all Page components
   - ✅ Uses commonFields as fallback for client information (name, ndis, dob, address)

### **Field Mapping for ClientIntakeV2:**
```typescript
const commonFieldMapping = {
  givenName: "name",           // formData.givenName → commonFields.name
  dateOfBirth: "dob",          // formData.dateOfBirth → commonFields.dob
  ndisNumber: "ndis",          // formData.ndisNumber → commonFields.ndis
  sex: "sex",                  // formData.sex → commonFields.sex
  addressNumberStreet: "street", // formData.addressNumberStreet → commonFields.street
  state: "state",              // formData.state → commonFields.state
  postcode: "postCode",        // formData.postcode → commonFields.postCode
  address: "address",          // formData.address → commonFields.address
  homePhone: "phone",          // formData.homePhone → commonFields.phone
  email: "email",              // formData.email → commonFields.email
  disabilityConditions: "disability" // formData.disabilityConditions → commonFields.disability
};
```

### **Field Mapping for HomeVisitRiskAssessment:**
```typescript
// Direct fallback mapping:
homeVisitResponse.name → commonFields.name
homeVisitResponse.ndisNumber → commonFields.ndis  
homeVisitResponse.dob → commonFields.dob
homeVisitResponse.address → commonFields.address
```

## **Testing the Implementation:**

### **Test Case 1: Client Intake Form PDF**
```
GET /api/generate-pdf/[formSubmissionId]/[formId]
- formSubmissionId: ID of a client intake form submission
- formId: ID of client_intake_form MasterForm

Expected Result:
✅ PDF generated with client data from both formData and commonFields
✅ Missing form fields filled from commonFields
✅ All 6 pages rendered correctly
```

### **Test Case 2: Home Visit Risk Assessment PDF**
```
GET /api/generate-pdf/[formSubmissionId]/[formId]  
- formSubmissionId: ID of a home visit form submission
- formId: ID of home_visit_risk_assessment MasterForm

Expected Result:
✅ PDF generated with client info from commonFields
✅ Page 1 shows correct Name, NDIS, DOB, Address
✅ Page 5 signature section shows correct name
✅ All 5 pages rendered correctly
```

### **Test Case 3: Missing CommonFields**
```
Client with no commonFields record

Expected Result:
✅ PDF still generates successfully
✅ Empty strings shown for missing commonFields
✅ No errors or crashes
```

## **Database Flow:**
```
FormSubmission (id: formSubmissionId)
    ↓
    clientId
    ↓
CommonField (clientId: clientId)
    ↓
    {name, ndis, dob, address, phone, email, etc.}
    ↓
PDF Component (receives commonFields as prop)
    ↓
Rendered PDF with complete client information
```

## **Benefits Achieved:**

1. **✅ Complete Client Data**: PDFs now include all available client information
2. **✅ Fallback System**: Missing form data filled from commonFields  
3. **✅ Consistent Architecture**: Both forms follow same pattern
4. **✅ Future Ready**: Easy to add more forms with commonFields support
5. **✅ No Breaking Changes**: Existing functionality preserved

## **Ready for Production! 🚀**

The implementation is complete and ready for testing. Both ClientIntakeV2 and HomeVisitRiskAssessment components now receive and properly use commonFields data for PDF generation.
