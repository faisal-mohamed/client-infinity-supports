# Signature Link Generation Fixes

## Issues Fixed

### **Issue 1: Wrong Port in Generated Links**
**Problem:** Links were hardcoded to `http://localhost:3000` instead of using the actual port (3001)

**Solution:** Updated URL generation to use request headers
```typescript
// Before
signatureUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/forms/signature/${batchToken}`

// After  
const protocol = req.headers.get('x-forwarded-proto') || 'http';
const host = req.headers.get('host') || 'localhost:3001';
const baseUrl = `${protocol}://${host}`;
signatureUrl: `${baseUrl}/forms/signature/${batchToken}`
```

### **Issue 2: Prisma Query Errors**
**Problem:** Using both `include` and `select` in the same query, which is invalid in Prisma

**Locations Fixed:**
1. `/api/clients/[id]/signature-links/route.ts`
2. `/api/signature/[token]/route.ts`

**Solution:** Removed conflicting `select` statements, kept only `include`

## Files Modified

### **1. `/api/clients/[id]/generate-signature-link/route.ts`**
- Fixed URL generation to use correct port from request headers
- Now generates links with the actual running port (3001)

### **2. `/api/clients/[id]/signature-links/route.ts`**
- Fixed Prisma query by removing conflicting `select` on `formSubmission`
- Now properly fetches signature batches without errors

### **3. `/api/signature/[token]/route.ts`**
- Fixed Prisma query by removing conflicting `select` on `formSubmission`
- Now properly fetches signature batch data for client access

## How It Works Now

### **Link Generation Process:**
1. Admin selects forms and clicks "Generate Link"
2. API creates FormBatch with `isSignatureOnly: true`
3. Creates SignatureBatchForm entries for each selected form
4. Generates URL using actual request host/port
5. Returns correct signature URL

### **Link Access Process:**
1. Client accesses signature link with token
2. API fetches batch data using fixed Prisma query
3. Shows list of forms requiring signature
4. Client can sign each form individually

### **Manage Links Process:**
1. Admin clicks "Manage Links"
2. API fetches all signature batches using fixed Prisma query
3. Shows list with status, forms, and actions
4. Admin can edit expiry, copy links, delete batches

## Testing

### **Test Link Generation:**
1. Go to `/admin/clients/[id]/forms`
2. Select completed forms
3. Click "Generate Link"
4. Verify link uses correct port (3001)

### **Test Link Access:**
1. Copy generated signature link
2. Open in new tab/browser
3. Should show forms to sign (no Prisma errors)

### **Test Manage Links:**
1. Go to `/admin/clients/[id]/signature-links`
2. Should show created links (no Prisma errors)
3. Can edit expiry, copy links, delete

## Benefits
- ✅ **Correct URLs** - Links use actual running port
- ✅ **No Database Errors** - Fixed Prisma query conflicts
- ✅ **Working Link Management** - Can view, edit, delete signature links
- ✅ **Client Access** - Signature links work properly for clients
- ✅ **Flexible Deployment** - Works on any port/domain

The signature link system should now work completely end-to-end!
