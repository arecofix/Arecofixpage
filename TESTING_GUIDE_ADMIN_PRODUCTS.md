# Testing Guide - Admin Products CRUD Fix

## Quick Test Steps

### 1. Test Product Update (Price & Photos)

1. **Navigate to Admin Products:**
   - Open browser: `http://localhost:4200/admin/products`
   - Login if required

2. **Select an Existing Product:**
   - Click on any product to edit it
   - You should see the product form with three tabs: General, Precio y Stock, Multimedia

3. **Test Price Update:**
   - Go to "Precio y Stock" tab
   - Change the price value
   - Click "Guardar" button
   - Verify you're redirected to the products list
   - Check that the price has been updated in the list
   - Refresh the page to confirm the change persisted

4. **Test Photo Update:**
   - Edit the same product again
   - Go to "Multimedia" tab
   - Upload a new image or remove existing ones
   - Click "Guardar" button
   - Verify the images are updated
   - Refresh the page to confirm images persisted

### 2. Test Product Creation

1. **Create New Product:**
   - Click "Nuevo Producto" button
   - Fill in required fields:
     - Name (required)
     - Price (required)
   - Upload at least one image
   - Click "Guardar"
   - Verify the product appears in the list

### 3. Verify Console Warnings

1. **Open Browser DevTools:**
   - Press F12
   - Go to Console tab

2. **Check for Errors:**
   - ✅ Should NOT see: "Error updating product" or "Error creating product"
   - ⚠️ May still see: Facebook Pixel warnings (these are harmless and from Facebook's external script)
   - ✅ Should see: "[DEBUG]" messages from PostHog (normal)

### 4. Database Verification

1. **Check Supabase:**
   - Go to your Supabase dashboard
   - Navigate to Table Editor > products
   - Verify the updated/created products appear with correct data
   - Check that `gallery_urls` field contains the image URLs
   - Check that `updated_at` timestamp is current

## Expected Behavior

### ✅ What Should Work Now:

- Creating new products saves to database
- Updating product prices saves to database
- Updating product photos saves to database
- All fields (name, description, sku, barcode, currency, stock, etc.) save correctly
- Images upload to Supabase storage and URLs save to database
- Form validation works (required fields)
- Error messages display if something goes wrong
- Success: redirect to products list after save

### ⚠️ Known Warnings (Harmless):

- Facebook Pixel: "Unrecognized feature: 'attribution-reporting'"
- Facebook Pixel: "Unrecognized feature: 'browsing-topics'"
- These are from Facebook's external script and don't affect functionality

## Troubleshooting

### If Product Doesn't Save:

1. Check browser console for error messages
2. Check network tab for failed requests
3. Verify you're logged in with admin permissions
4. Check Supabase connection status

### If Images Don't Upload:

1. Check file size (should be reasonable, < 5MB recommended)
2. Check file format (jpg, png, webp supported)
3. Verify Supabase storage bucket permissions
4. Check browser console for upload errors

### If You See TypeScript Errors:

1. The build completed successfully, so there should be no TS errors
2. If you see errors in the IDE, try restarting the dev server
3. Clear `.angular` cache: `Remove-Item -Recurse -Force .angular` then restart

## Test Checklist

- [ ] Can create new product with price and images
- [ ] Can update existing product price
- [ ] Can update existing product images
- [ ] Can add multiple images to a product
- [ ] Can remove images from a product
- [ ] Changes persist after page refresh
- [ ] Changes visible in Supabase database
- [ ] No critical errors in browser console
- [ ] Form validation works correctly
- [ ] Success redirect to products list works

## Next Steps After Testing

If all tests pass:

1. ✅ Mark this issue as resolved
2. Consider deploying to production
3. Monitor production logs for any issues

If any tests fail:

1. Note which specific test failed
2. Check browser console for errors
3. Check network tab for failed requests
4. Report the specific error message for further debugging
