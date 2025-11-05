# 🧪 PDF Testing Checklist - Step by Step

## ✅ Quick Test (5 minutes)

### **Test 1: Check if Staff Has Data**

1. **Open Prisma Studio** (should be opening now):
   ```
   http://localhost:5555
   ```

2. **Click "StaffEmploymentDetails" table** (left sidebar)

3. **Check:**
   - ✅ Are there any rows?
   - ✅ Is there a `staffId` value?
   - ✅ Is there `data` JSON?
   - ✅ Is there `staffSignature`?

**If YES** → Continue to Test 2
**If NO** → Jump to "Create Test Data" section below

---

### **Test 2: Download PDF**

1. **Go to Admin Panel:**
   ```
   http://localhost:3000/admin/staff
   ```

2. **Find staff member** (from Prisma Studio, use the staffId)

3. **Click on staff member row**

4. **Look for "View Details" button** - Click it
   - URL should be: `/admin/staff/[id]`

5. **Find "Download PDF" button** - Click it

6. **What should happen:**
   - ✅ PDF downloads IMMEDIATELY (< 1 second)
   - ✅ File name: `FirstName_LastName_employment-details.pdf`
   - ✅ File downloads to your Downloads folder

**If download starts** → Continue to Test 3
**If error** → See "Troubleshooting" section below

---

### **Test 3: Check PDF Content**

1. **Open the downloaded PDF** (in Downloads folder)

2. **Check:**
   - ✅ PDF opens without errors
   - ✅ Has header at top: "Employee Details Form"
   - ✅ Has footer at bottom with website, version, date
   - ✅ All fields are visible (not cut off)
   - ✅ Signature appears
   - ✅ Data looks correct

3. **Count pages:**
   - How many pages? _____ pages
   - Expected: 1-4 pages depending on data amount

**If all looks good** → SUCCESS! 🎉
**If something wrong** → See "Troubleshooting" section

---

## 📋 Create Test Data (If No Staff Has Form Data)

### **Option A: Fill Form Manually** (Recommended)

1. **Create Staff Member:**
   ```
   http://localhost:3000/admin/staff/create
   ```
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: 0412345678
   - Click "Create"

2. **Generate Onboarding Link:**
   - Go back to staff list
   - Click on "Test User"
   - Find "Generate Link" button
   - Click it
   - Copy the link

3. **Open Onboarding Link:**
   - Paste link in new browser tab
   - Should show onboarding form

4. **Fill Employment Details Form:**
   - Fill required fields:
     - First Name: Test (pre-filled)
     - Last Name: User (pre-filled)
     - Start Date: Today
     - Position: Developer
     - Gender: Male
     - DOB: 01/01/1990
     - Address: 123 Test Street
     - Suburb: Perth
     - State: WA
     - Postcode: 6000
     - Mobile: 0412345678 (pre-filled)
     - Email: test@example.com (pre-filled)
     - Tax File: 123456789
     - Bank Name: Test Bank
     - Branch: Perth
     - Account Name: Test User
     - BSB: 123456
     - Account: 12345678
   
   - Scroll down to Signature section
   - **Draw signature** on canvas
   - Select today's date
   - Click "Next" or "Submit"

5. **Now test PDF download!**

---

### **Option B: Insert Test Data via SQL** (Quick)

1. **In Prisma Studio** (`http://localhost:5555`):

2. **Click "Staff" table**

3. **Note the ID** of any staff member (e.g., ID = 1)

4. **Click "StaffEmploymentDetails" table**

5. **Click "Add Record" button**

6. **Fill fields:**
   ```
   staffId: 1  (use actual staff ID from step 3)
   
   data: {
     "firstName": "John",
     "lastName": "Smith",
     "startDate": "2024-01-01",
     "positionTitle": "Developer",
     "gender": "Male",
     "dateOfBirth": "1990-06-15",
     "address": "123 Main St",
     "suburb": "Perth",
     "state": "WA",
     "postcode": "6000",
     "mobile": "0412345678",
     "email": "john@example.com",
     "employeeTaxFile": "123456789",
     "bankName": "Commonwealth",
     "bankBranch": "Perth",
     "accountName": "John Smith",
     "bsb": "123456",
     "accountNumber": "12345678",
     "isAustralianCitizen": "true",
     "nokName": "Jane Smith",
     "nokRelationship": "Spouse",
     "nokMobile": "0412987654",
     "employmentStatus": "FullTime",
     "schadsScore": "Level 3"
   }
   
   staffSignature: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==
   
   staffSignedAt: (today's date)
   
   createdAt: (today's date)
   
   updatedAt: (today's date)
   ```

7. **Click "Save"**

8. **Now test PDF download!**

---

## 🐛 Troubleshooting

### **Error: "Failed to generate PDF"**

**Check Browser Console:**
1. Press F12
2. Go to Console tab
3. Look for red errors
4. Common errors:

**Error: "Form data not found" (404)**
- **Cause:** Staff hasn't filled form
- **Fix:** Follow "Create Test Data" above

**Error: "Staff not found" (404)**
- **Cause:** Wrong staff ID
- **Fix:** Check URL, use correct staff ID

**Error: "Cannot find module '@react-pdf/renderer'"**
- **Cause:** Package not installed
- **Fix:**
  ```bash
  npm install @react-pdf/renderer
  npm run dev
  ```

**Error: "renderToBuffer is not a function"**
- **Cause:** Old route.ts file
- **Fix:** Make sure route.ts imports from @react-pdf/renderer

---

### **PDF Downloads But Won't Open**

**Try:**
1. Different PDF reader (Adobe, Chrome, Firefox)
2. Re-download PDF
3. Check file size (should be > 10KB)

---

### **PDF Has No Content / Blank**

**Check:**
1. Data exists in database (Prisma Studio)
2. staffSignature field is not null
3. Browser console for errors
4. Terminal logs for errors

---

### **Check Server Terminal Logs**

Look at terminal where `npm run dev` is running:

**Good logs:**
```
Generating PDF for staff: John Smith
PDF generated successfully: John_Smith_employment-details.pdf
```

**Error logs:**
```
Error generating staff PDF: [error message]
```

If you see errors, copy the error message and check what it says.

---

## 🎯 Expected Behavior

### **✅ Success Looks Like:**

1. **Fast Download:** < 1 second
2. **File Downloaded:** Appears in Downloads folder
3. **File Name:** `FirstName_LastName_employment-details.pdf`
4. **File Size:** 15-50 KB (varies by data and signature)
5. **PDF Opens:** No errors
6. **Content Visible:** All data readable
7. **Pages:** 1-4 pages (varies by data amount)
8. **Header:** Appears on every page
9. **Footer:** Appears on every page
10. **Signature:** Shows as image

### **❌ Failure Looks Like:**

1. **Slow/Hangs:** Takes > 5 seconds
2. **Error Message:** Alert or console error
3. **No Download:** Nothing happens
4. **Corrupt PDF:** Can't open file
5. **Blank PDF:** Opens but no content
6. **Cut Off Content:** Data missing or truncated

---

## 📊 Test Results Template

Fill this out:

```
Date: __________
Tester: __________

✅ Test 1: Staff Has Data
   - Staff ID: ____
   - Has form data: YES / NO
   - Has signature: YES / NO

✅ Test 2: Download PDF
   - Download started: YES / NO
   - Download speed: ____ seconds
   - File name: ____________
   - File size: ____ KB

✅ Test 3: PDF Content
   - Opens successfully: YES / NO
   - Pages count: ____ pages
   - Header visible: YES / NO
   - Footer visible: YES / NO
   - Signature visible: YES / NO
   - Data complete: YES / NO
   - Professional look: YES / NO

Overall Result: PASS / FAIL

Notes:
_________________________________
_________________________________
```

---

## 🚀 Advanced Testing

### **Test A: Minimal Data (1-2 pages)**

1. Fill only required fields
2. Skip optional fields
3. Add signature
4. Download PDF
5. **Expected:** 1-2 pages

### **Test B: Average Data (2-3 pages)**

1. Fill most fields
2. Include bank details
3. Include next of kin
4. Add signature
5. Download PDF
6. **Expected:** 2-3 pages

### **Test C: Maximum Data (3-4+ pages)**

1. Fill ALL fields
2. Add long text in "Work Restrictions" (500 words)
3. Fill all next of kin details
4. Add signature
5. Download PDF
6. **Expected:** 3-4+ pages

### **Test D: Speed Test**

1. Time how long it takes
2. Compare to old system (2-3 seconds)
3. **Expected:** < 1 second with React PDF

---

## ✅ Success Criteria

Migration is successful if:

- [ ] PDF downloads without errors
- [ ] Download is FAST (< 1 second)
- [ ] PDF opens in reader
- [ ] All data is visible
- [ ] Pages vary by data amount
- [ ] Header on all pages
- [ ] Footer on all pages
- [ ] Signature displays correctly
- [ ] Professional appearance
- [ ] No browser console errors
- [ ] No server terminal errors

---

## 📞 Need More Help?

1. **Check both:**
   - Browser console (F12)
   - Server terminal logs

2. **Look for error messages**

3. **Share:**
   - What step fails?
   - Error message text
   - Screenshot if helpful

---

**Start with Test 1!** Go to Prisma Studio and check if you have data! 🚀

