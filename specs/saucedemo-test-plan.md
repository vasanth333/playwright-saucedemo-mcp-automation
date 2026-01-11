# SauceDemo E-Commerce Test Plan

## Application Overview

SauceDemo (www.saucedemo.com) is a sample e-commerce website designed for testing automation. It simulates a complete online shopping experience with various user types, product catalog browsing, shopping cart functionality, and checkout process. The application includes multiple test user accounts with different behaviors (standard user, locked out user, problem user, performance glitch user, error user, visual user) to test various scenarios and edge cases.

## Test Scenarios

### 1. Authentication & User Management

**Seed:** `tests/seed.spec.ts`

#### 1.1. Valid Login - Standard User

**File:** `tests/authentication/valid-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Verify login page displays with username and password fields
  3. Enter 'standard_user' in username field
  4. Enter 'secret_sauce' in password field
  5. Click the Login button
  6. Verify successful redirect to inventory page (/inventory.html)
  7. Verify 'Products' heading is displayed
  8. Verify navigation menu is accessible

**Expected Results:**
  - Login page loads successfully with required fields
  - Valid credentials allow access to the application
  - User is redirected to inventory page after successful login
  - Application interface displays properly for authenticated user

#### 1.2. Invalid Login Credentials

**File:** `tests/authentication/invalid-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'invalid_user' in username field
  3. Enter 'wrong_password' in password field
  4. Click the Login button
  5. Verify error message appears
  6. Verify user remains on login page
  7. Verify error message text: 'Epic sadface: Username and password do not match any user in this service'

**Expected Results:**
  - Appropriate error message is displayed for invalid credentials
  - User is not granted access to the application
  - Error message clearly indicates credential mismatch
  - Login form remains accessible after failed attempt

#### 1.3. Locked Out User Access

**File:** `tests/authentication/locked-user.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'locked_out_user' in username field
  3. Enter 'secret_sauce' in password field
  4. Click the Login button
  5. Verify error message appears
  6. Verify error message text: 'Epic sadface: Sorry, this user has been locked out.'
  7. Verify user remains on login page

**Expected Results:**
  - Locked out user is denied access
  - Specific error message indicates user lockout status
  - Application properly handles locked user scenario
  - Security measure is properly implemented

#### 1.4. Logout Functionality

**File:** `tests/authentication/logout.spec.ts`

**Steps:**
  1. Login with standard_user credentials
  2. Navigate to inventory page
  3. Click the hamburger menu button
  4. Verify navigation menu opens
  5. Click 'Logout' option
  6. Verify redirect to login page
  7. Verify session is terminated
  8. Attempt to access inventory page directly via URL
  9. Verify redirect back to login page

**Expected Results:**
  - Logout process completes successfully
  - User is redirected to login page after logout
  - Session is properly terminated
  - Direct URL access is prevented after logout

### 2. Product Catalog & Inventory Management

**Seed:** `tests/seed.spec.ts`

#### 2.1. Product Listing Display

**File:** `tests/inventory/product-listing.spec.ts`

**Steps:**
  1. Login with standard_user
  2. Navigate to inventory page
  3. Verify all 6 products are displayed
  4. Verify each product shows image, name, description, and price
  5. Verify 'Add to cart' button is present for each product
  6. Verify product names: Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket, Onesie, Test.allTheThings() T-Shirt
  7. Verify pricing information is displayed correctly

**Expected Results:**
  - All products are displayed in grid layout
  - Product information is complete and accurate
  - Images load properly for all products
  - Pricing is displayed in correct format
  - Add to cart functionality is available for all products

#### 2.2. Product Sorting Functionality

**File:** `tests/inventory/product-sorting.spec.ts`

**Steps:**
  1. Login with standard_user
  2. Navigate to inventory page
  3. Verify default sorting is 'Name (A to Z)'
  4. Select 'Name (Z to A)' from sort dropdown
  5. Verify products are sorted alphabetically in reverse order
  6. Select 'Price (low to high)' from sort dropdown
  7. Verify products are sorted by price ascending (Onesie $7.99 first, Fleece Jacket $49.99 last)
  8. Select 'Price (high to low)' from sort dropdown
  9. Verify products are sorted by price descending

**Expected Results:**
  - Default sorting works correctly
  - All sorting options function properly
  - Product order updates immediately after selection
  - Price sorting maintains correct numerical order
  - Alphabetical sorting maintains correct letter order

#### 2.3. Product Detail Page

**File:** `tests/inventory/product-detail.spec.ts`

**Steps:**
  1. Login with standard_user
  2. Navigate to inventory page
  3. Click on 'Sauce Labs Onesie' product image or name
  4. Verify navigation to product detail page (/inventory-item.html?id=2)
  5. Verify large product image is displayed
  6. Verify product name, description, and price are shown
  7. Verify 'Add to cart' button is present
  8. Verify 'Back to products' button is available
  9. Click 'Back to products' button
  10. Verify return to inventory page

**Expected Results:**
  - Product detail page loads with correct product information
  - Larger product image provides better view
  - All product details are accurately displayed
  - Navigation between inventory and detail pages works correctly
  - Add to cart functionality is available on detail page

### 3. Shopping Cart Functionality

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add Items to Cart

**File:** `tests/cart/add-items.spec.ts`

**Steps:**
  1. Login with standard_user
  2. Navigate to inventory page
  3. Verify cart badge is not visible initially
  4. Click 'Add to cart' for 'Sauce Labs Backpack'
  5. Verify cart badge displays '1'
  6. Verify button text changes to 'Remove'
  7. Click 'Add to cart' for 'Sauce Labs Bike Light'
  8. Verify cart badge displays '2'
  9. Verify both items have 'Remove' buttons
  10. Add additional items and verify cart count increases

**Expected Results:**
  - Cart badge updates correctly with item count
  - Add to cart buttons change to Remove buttons
  - Multiple items can be added to cart
  - Cart count accurately reflects number of items
  - Visual feedback is provided for cart updates

#### 3.2. Shopping Cart Page Navigation

**File:** `tests/cart/cart-navigation.spec.ts`

**Steps:**
  1. Login with standard_user
  2. Add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to cart
  3. Click on shopping cart badge
  4. Verify navigation to cart page (/cart.html)
  5. Verify 'Your Cart' heading is displayed
  6. Verify cart items table with QTY and Description columns
  7. Verify both items are listed with quantity '1' each
  8. Verify item details: name, description, price
  9. Verify 'Continue Shopping' and 'Checkout' buttons are present

**Expected Results:**
  - Cart page displays all added items correctly
  - Item quantities are shown accurately
  - Product information matches original listings
  - Navigation options are available (Continue Shopping, Checkout)
  - Cart totals and item counts are correct

#### 3.3. Remove Items from Cart

**File:** `tests/cart/remove-items.spec.ts`

**Steps:**
  1. Login with standard_user
  2. Add multiple items to cart
  3. Navigate to cart page
  4. Click 'Remove' button for one item
  5. Verify item is removed from cart
  6. Verify cart count decreases
  7. Navigate back to inventory
  8. Verify removed item shows 'Add to cart' button again
  9. Return to cart and remove all remaining items
  10. Verify empty cart state

**Expected Results:**
  - Items can be removed from cart successfully
  - Cart count updates when items are removed
  - Removed items revert to 'Add to cart' state in inventory
  - Empty cart state is handled properly
  - Remove functionality works from both cart page and inventory

### 4. Checkout Process & Order Management

**Seed:** `tests/seed.spec.ts`

#### 4.1. Complete Checkout Process

**File:** `tests/checkout/complete-checkout.spec.ts`

**Steps:**
  1. Login with standard_user
  2. Add 'Sauce Labs Backpack' ($29.99) and 'Sauce Labs Bike Light' ($9.99) to cart
  3. Navigate to cart page
  4. Click 'Checkout' button
  5. Verify navigation to checkout step one (/checkout-step-one.html)
  6. Fill First Name: 'John'
  7. Fill Last Name: 'Doe'
  8. Fill Zip/Postal Code: '12345'
  9. Click 'Continue' button
  10. Verify navigation to checkout overview (/checkout-step-two.html)
  11. Verify order summary displays both items
  12. Verify payment information: 'SauceCard #31337'
  13. Verify shipping: 'Free Pony Express Delivery!'
  14. Verify item total: '$39.98'
  15. Verify tax: '$3.20'
  16. Verify total: '$43.18'
  17. Click 'Finish' button
  18. Verify order confirmation page (/checkout-complete.html)
  19. Verify 'Thank you for your order!' message
  20. Click 'Back Home' button
  21. Verify return to inventory page

**Expected Results:**
  - Complete checkout process flows smoothly
  - All form validations work correctly
  - Order summary calculations are accurate
  - Payment and shipping information is displayed
  - Order confirmation provides proper feedback
  - User can return to shopping after completion

#### 4.2. Checkout Form Validation

**File:** `tests/checkout/form-validation.spec.ts`

**Steps:**
  1. Login with standard_user
  2. Add item to cart and proceed to checkout
  3. Leave First Name field empty
  4. Fill Last Name and Postal Code
  5. Click 'Continue' button
  6. Verify error message for missing first name
  7. Fill First Name, leave Last Name empty
  8. Click 'Continue' button
  9. Verify error message for missing last name
  10. Fill First and Last Name, leave Postal Code empty
  11. Click 'Continue' button
  12. Verify error message for missing postal code
  13. Test with invalid characters in fields

**Expected Results:**
  - Required field validation works correctly
  - Appropriate error messages are displayed
  - Form submission is prevented when required fields are missing
  - Input validation handles edge cases properly
  - Error messages are clear and helpful

#### 4.3. Checkout Cancel Functionality

**File:** `tests/checkout/checkout-cancel.spec.ts`

**Steps:**
  1. Login with standard_user
  2. Add items to cart and proceed to checkout
  3. On checkout step one, click 'Cancel' button
  4. Verify return to cart page
  5. Verify items remain in cart
  6. Proceed to checkout again and continue to step two
  7. On checkout overview page, click 'Cancel' button
  8. Verify return to cart page
  9. Verify items still remain in cart

**Expected Results:**
  - Cancel buttons work at all checkout steps
  - Cart contents are preserved when canceling
  - User can resume checkout after canceling
  - No data is lost during cancel operations
  - Navigation flows work correctly

### 5. Navigation & User Interface

**Seed:** `tests/seed.spec.ts`

#### 5.1. Main Navigation Menu

**File:** `tests/navigation/main-menu.spec.ts`

**Steps:**
  1. Login with standard_user
  2. Click hamburger menu button
  3. Verify menu opens with options: All Items, About, Logout, Reset App State
  4. Click 'All Items' and verify navigation to inventory
  5. Open menu and click 'About' link
  6. Verify navigation to external Sauce Labs website
  7. Navigate back to application
  8. Open menu and click 'Reset App State'
  9. Verify cart is cleared and application state is reset
  10. Click 'Close Menu' button and verify menu closes

**Expected Results:**
  - Navigation menu opens and closes properly
  - All menu items are functional
  - External links work correctly
  - Reset App State clears all user data
  - Menu can be closed using Close button

#### 5.2. Responsive Design Elements

**File:** `tests/ui/responsive-design.spec.ts`

**Steps:**
  1. Login with standard_user
  2. Verify header layout with logo and cart
  3. Verify product grid layout on inventory page
  4. Navigate to cart page and verify table layout
  5. Proceed to checkout and verify form layout
  6. Test navigation breadcrumbs and page titles
  7. Verify footer social media links
  8. Test all interactive elements for proper styling

**Expected Results:**
  - All page layouts display correctly
  - Interactive elements are properly styled
  - Navigation elements are consistent
  - Footer links function correctly
  - Visual hierarchy is maintained across pages

### 6. Error Handling & Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 6.1. Problem User Scenarios

**File:** `tests/errors/problem-user.spec.ts`

**Steps:**
  1. Login with 'problem_user' account
  2. Verify successful login
  3. Navigate through product listings
  4. Attempt to add products to cart
  5. Observe any UI anomalies or issues
  6. Proceed through checkout process
  7. Document any problems or glitches encountered
  8. Test all major functionality with problem user

**Expected Results:**
  - Problem user reveals UI/UX issues
  - Application handles problematic scenarios
  - Issues are identified but don't break core functionality
  - Error handling mechanisms are tested
  - User experience degradation is documented

#### 6.2. Performance Glitch User

**File:** `tests/errors/performance-user.spec.ts`

**Steps:**
  1. Login with 'performance_glitch_user' account
  2. Measure page load times
  3. Navigate between pages and measure response times
  4. Add items to cart and observe performance
  5. Complete checkout process while monitoring performance
  6. Compare performance with standard_user
  7. Document performance differences

**Expected Results:**
  - Performance issues are identified with glitch user
  - Application remains functional despite performance issues
  - Response times are measurably different
  - Performance testing capabilities are validated
  - Baseline performance metrics are established

#### 6.3. Direct URL Access Security

**File:** `tests/errors/url-security.spec.ts`

**Steps:**
  1. Attempt to access /inventory.html without login
  2. Verify redirect to login page
  3. Attempt to access /cart.html without login
  4. Verify redirect to login page
  5. Attempt to access checkout pages without login
  6. Verify proper authentication enforcement
  7. Test with invalid URLs
  8. Verify 404 or appropriate error handling

**Expected Results:**
  - Unauthorized access is prevented
  - Proper redirects to login page occur
  - Authentication is enforced across all protected pages
  - Invalid URLs are handled appropriately
  - Security measures are properly implemented
