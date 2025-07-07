# Signature Validation System

## Overview

The new signature validation system provides a flexible, registry-based approach to handle multiple signature requirements per form. It validates signature completion based on form configuration and provides accurate status updates.

## Key Components

### 1. Form Registry Configuration
Each form defines its signature requirements in the registry:

```typescript
// Current: Single signature form
'home_visit_risk_assessment': {
  signatures: [
    {
      id: 'client_signature',
      label: 'Client Signature',
      required: true,
      dataKey: 'signature' // Maps to formData.signature
    }
  ]
}

// Future: Multiple signature form example
'complex_assessment': {
  signatures: [
    {
      id: 'client_signature',
      label: 'Client Signature',
      required: true,
      dataKey: 'clientSignature'
    },
    {
      id: 'witness_signature', 
      label: 'Witness Signature',
      required: true,
      dataKey: 'witnessSignature'
    },
    {
      id: 'guardian_signature',
      label: 'Guardian Signature',
      required: false,
      dataKey: 'guardianSignature',
      condition: (formData) => formData.age < 18 // Conditional requirement
    }
  ]
}
```

### 2. Signature Validation Logic
The `validateFormSignatures()` function:
- Reads signature requirements from form registry
- Checks form data for completed signatures
- Handles conditional requirements
- Returns detailed validation results

### 3. Enhanced Status System
Status now reflects signature completion accurately:
- **"Signature Complete"** - Single signature form completed
- **"All Signatures Complete"** - Multiple signature form completed  
- **"Signatures: 2/3 Complete"** - Partial completion
- **"Ready for Signatures"** - No signatures yet
- **"Admin Completed"** - No signatures required

### 4. Database Storage
Signature completion stored in `FormSubmission.clientSignature` as JSON:
```json
{
  "status": "COMPLETED",
  "completedSignatures": ["client_signature", "witness_signature"],
  "completedAt": "2025-01-07T10:30:00Z",
  "totalRequired": 2
}
```

## Workflow

### Admin Edit Component
1. Admin fills form including signature(s)
2. System validates all required signatures using registry
3. If complete → Updates `clientSignature` with completion data
4. Status immediately shows "Signature Complete" or "All Signatures Complete"

### Signature Portal (Legacy Support)
1. Traditional workflow still works
2. Client signs via portal
3. Updates `clientSignature` field
4. Status updates accordingly

## Benefits

### Current (Single Signature)
- ✅ Accurate status for home visit risk assessment
- ✅ Immediate completion when admin signs
- ✅ No need for separate signature links when admin signs

### Future (Multiple Signatures)
- ✅ Support for complex forms with multiple signatures
- ✅ Conditional signature requirements
- ✅ Progress tracking (2/3 signatures complete)
- ✅ Clear indication of missing signatures

## Testing Scenarios

### Scenario 1: Current Home Visit Form
1. Admin fills form with signature → Status: "Signature Complete" ✅
2. Admin fills form without signature → Status: "Ready for Signatures" ✅
3. Generate signature link → Client signs → Status: "Signature Complete" ✅

### Scenario 2: Future Multiple Signature Form
1. Admin fills with 1/2 signatures → Status: "Signatures: 1/2 Complete"
2. Admin fills with 2/2 signatures → Status: "All Signatures Complete"
3. Conditional signature based on age/risk level

### Scenario 3: Mixed Forms
1. Client has both single and multiple signature forms
2. Progress accurately reflects completion state
3. Clear indication of what's needed

## Migration Strategy

### Backward Compatibility
- Existing single signatures still work
- Legacy `clientSignature` format supported
- No breaking changes to existing workflows

### Future Enhancement
- Add new forms with multiple signature requirements
- Conditional signature logic based on form data
- Enhanced UI for signature progress tracking

## Implementation Files

### Core System
- `/src/lib/signatureValidation.ts` - Validation logic
- `/src/app/forms/registry.ts` - Form configuration
- `/src/app/api/form-assignments/[id]/save/route.ts` - API logic

### UI Components  
- `/src/app/admin/clients/[id]/forms/ClientFormsPageClient.tsx` - Status display
- `/src/components/ui/SignatureCanvas.tsx` - Unified signature component

### Database
- `FormSubmission.clientSignature` - JSON completion data
- `FormSubmission.data` - Individual signature fields

## Future Enhancements

1. **Signature Progress UI**: Visual progress bars for multi-signature forms
2. **Email Notifications**: Alert when specific signatures are missing
3. **Role-Based Signatures**: Different signature requirements by user role
4. **Digital Timestamps**: Enhanced audit trail for signature completion
5. **Signature Validation**: Verify signature authenticity and integrity
