# Signature Infinite Loop Fix

## Issue
When accessing a signature link and clicking "Proceed to Sign", the application threw an infinite loop error:

```
Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate.
```

## Root Cause
The issue was in `FormSignaturePageClient.tsx` at line 331:

```typescript
// PROBLEMATIC CODE
const [signatureRef, setSignatureRef] = useState<SignatureCanvasRef | null>(null);

// In render:
<SignatureCanvas
  ref={(ref) => setSignatureRef(ref)}  // ← This causes infinite loop
  // ...
/>
```

**Why this caused infinite loop:**
1. Component renders → `ref` callback executes → `setSignatureRef(ref)` called
2. `setSignatureRef` triggers state update → Component re-renders
3. Component re-renders → `ref` callback executes again → `setSignatureRef(ref)` called
4. Infinite loop continues...

## Solution
Replaced `useState` with `useRef` for the signature canvas reference:

```typescript
// FIXED CODE
const signatureRef = useRef<SignatureCanvasRef | null>(null);

// In render:
<SignatureCanvas
  ref={signatureRef}  // ← Direct ref assignment, no state update
  // ...
/>
```

**Why this fixes the issue:**
1. `useRef` doesn't trigger re-renders when the ref value changes
2. Direct ref assignment is stable and doesn't cause render cycles
3. `signatureRef.current` provides access to the canvas methods

## Files Changed
- `/src/app/forms/signature/[token]/[formSubmissionId]/FormSignaturePageClient.tsx`
  - Added `useRef` import
  - Changed `useState` to `useRef` for signature reference
  - Updated `submitSignature` function to use `signatureRef.current`
  - Updated SignatureCanvas ref prop to direct assignment

## Testing Steps
1. **Generate signature link**: 
   - Go to `/admin/clients/[id]/forms`
   - Fill a form requiring signature
   - Generate signature link

2. **Access signature portal**:
   - Open the generated link
   - Should load without errors

3. **Test signature process**:
   - Click "Proceed to Sign" 
   - Should show signature pad without infinite loop error
   - Draw signature and submit
   - Should redirect back to forms list

## Verification
- ✅ No more "Maximum update depth exceeded" error
- ✅ Signature pad loads correctly
- ✅ Signature submission works
- ✅ Navigation back to forms list works

## Prevention
To avoid similar issues in the future:
1. **Use `useRef` for DOM references** instead of `useState`
2. **Avoid calling `setState` in ref callbacks**
3. **Be cautious with state updates in render cycles**
4. **Use React DevTools to detect unnecessary re-renders**

## Related Components
This fix also ensures the unified `SignatureCanvas` component works correctly in both:
- Edit component (admin signing)
- Signature portal (client signing)

Both now use the same stable ref pattern without infinite loops.
