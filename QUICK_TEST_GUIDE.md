# Quick Test Guide - Admin Products CRUD

## 🚀 Quick Test (5 minutes)

### Prerequisites

- Dev server running on `http://localhost:4200`
- Admin access to the application
- At least one product in the database

### Test 1: Update Product Price ⏱️ 2 min

1. **Navigate:** `http://localhost:4200/admin/products`
2. **Click:** Any product to edit
3. **Go to:** "Precio y Stock" tab
4. **Change:** Price value (e.g., from 1000 to 1500)
5. **Click:** "Guardar" button
6. **Expected:**
   - ✅ Redirects to products list
   - ✅ Price shows new value (1500)
   - ✅ NO errors in console
7. **Refresh:** Page (F5)
8. **Expected:**
   - ✅ Price still shows 1500
   - ✅ Change persisted in database

### Test 2: Update Product Photos ⏱️ 2 min

1. **Navigate:** `http://localhost:4200/admin/products`
2. **Click:** Same product to edit
3. **Go to:** "Multimedia" tab
4. **Upload:** A new image (or remove existing)
5. **Click:** "Guardar" button
6. **Expected:**
   - ✅ Redirects to products list
   - ✅ Image updated
   - ✅ NO errors in console
7. **Refresh:** Page (F5)
8. **Expected:**
   - ✅ Images still correct
   - ✅ Changes persisted

### Test 3: Create New Product ⏱️ 1 min

1. **Click:** "Nuevo Producto" button
2. **Fill:**
   - Name: "Test Product"
   - Price: 999
3. **Upload:** One image
4. **Click:** "Guardar"
5. **Expected:**
   - ✅ Redirects to products list
   - ✅ New product appears
   - ✅ NO errors in console

## ✅ Success Criteria

All tests pass if:

- No `400 Bad Request` errors
- No `PGRST204` errors about currency column
- Changes persist after page refresh
- Redirects work correctly

## ❌ If Tests Fail

### Check Console for Errors:

1. Press F12 to open DevTools
2. Go to Console tab
3. Look for red error messages
4. Report the specific error

### Common Issues:

**Error: "Could not find the 'currency' column"**

- ❌ This should NOT happen anymore
- If you see this, the fix didn't apply correctly
- Check that you saved all files

**Error: "400 Bad Request"**

- Check the error details in console
- Verify which field is causing the issue
- May indicate another missing column

**Images not uploading:**

- Check file size (< 5MB recommended)
- Check file format (jpg, png, webp)
- Check Supabase storage permissions

## 📊 Console Output Reference

### ✅ Expected (Normal):

```
[DEBUG] Sending test event to PostHog...
[DEBUG] Test event sent to PostHog
Angular is running in development mode.
```

### ⚠️ Safe to Ignore:

```
fbevents.js:338 Unrecognized feature: 'attribution-reporting'
Unrecognized feature: 'browsing-topics'
```

_These are from Facebook's tracking script and don't affect functionality_

### ❌ Should NOT See:

```
PGRST204: Could not find the 'currency' column
400 (Bad Request)
[ERROR] Error updating product
[ERROR] Failed to update product
```

## 🎯 Next Steps After Testing

### If All Tests Pass:

1. ✅ Mark issue as resolved
2. Consider deploying to production
3. Monitor production for any issues

### If Any Test Fails:

1. Note which specific test failed
2. Check browser console for errors
3. Check network tab for failed requests
4. Report the specific error message

## 📝 Notes

- The currency field has been removed (not in database)
- All prices are in ARS (Argentine Peso)
- Multiple images supported via gallery
- First image becomes the main product image
