# Authentication Testing Guide

## Test User Credentials
```
Email: test@example.com
Password: testpassword123
User ID: 68fe8de203d459186abf9d39
```

## Testing Checklist

### 1. Basic Authentication Tests ✓

#### Test 1.1: Login Page Access
- [ ] Navigate to http://localhost:3004/login
- [ ] Verify login form is displayed
- [ ] Check email and password input fields exist
- [ ] Verify "Sign In" button is present

#### Test 1.2: Successful Login
- [ ] Enter email: `test@example.com`
- [ ] Enter password: `testpassword123`
- [ ] Click "Sign In"
- [ ] Verify redirect to dashboard (/)
- [ ] Check no error messages displayed

#### Test 1.3: Failed Login - Invalid Credentials
- [ ] Navigate to http://localhost:3004/login
- [ ] Enter email: `test@example.com`
- [ ] Enter password: `wrongpassword`
- [ ] Click "Sign In"
- [ ] Verify error message: "Invalid credentials"
- [ ] Verify user stays on login page

#### Test 1.4: Failed Login - Non-existent User
- [ ] Enter email: `notfound@example.com`
- [ ] Enter password: `anypassword`
- [ ] Click "Sign In"
- [ ] Verify error message displayed
- [ ] Verify user stays on login page

#### Test 1.5: Session Persistence
- [ ] Login successfully
- [ ] Verify redirect to dashboard
- [ ] Refresh the page (F5)
- [ ] Verify still logged in (no redirect to login)
- [ ] Check session data is maintained

#### Test 1.6: Logout Functionality
- [ ] While logged in, look for logout button/option
- [ ] Click logout
- [ ] Verify redirect to login or home page
- [ ] Try accessing protected route (e.g., /courses/:id/enroll)
- [ ] Verify redirected to login

### 2. Protected API Routes Tests

#### Test 2.1: Course Enrollment API (Protected)
Open browser DevTools (F12) → Network tab

**When NOT logged in:**
- [ ] Navigate to any course details page
- [ ] Try to click "Enroll Now" button
- [ ] Check Network tab for POST to `/api/courses/[id]/enroll`
- [ ] Verify response: 401 Unauthorized
- [ ] Verify error: "Unauthorized"

**When logged in:**
- [ ] Login first with test user
- [ ] Navigate to a course details page
- [ ] Click "Enroll Now"
- [ ] Check Network tab for POST to `/api/courses/[id]/enroll`
- [ ] Verify response: 201 Created
- [ ] Verify response includes `enrollment` object with `userId: "68fe8de203d459186abf9d39"`
- [ ] Button changes to "Continue Learning"

#### Test 2.2: Progress Tracking API (Protected)
- [ ] While logged in, enroll in a course
- [ ] Navigate to a lesson page
- [ ] Check Network tab for GET to `/api/progress/[courseId]`
- [ ] Verify response: 200 OK
- [ ] Verify response includes user's progress data
- [ ] Complete a lesson
- [ ] Check for PUT to `/api/progress/[courseId]`
- [ ] Verify progress updates in response

#### Test 2.3: Course Reviews API (Protected)
- [ ] While logged in, navigate to course details
- [ ] Scroll to reviews section
- [ ] Try to submit a review (if enrolled with >20% progress)
- [ ] Check Network tab for POST to `/api/courses/[id]/reviews`
- [ ] Verify review is created with correct `userId`
- [ ] Verify review appears in the list

#### Test 2.4: Lesson Questions API (Protected)
- [ ] While logged in, navigate to a lesson
- [ ] Go to Q&A tab
- [ ] Try to post a question
- [ ] Check Network tab for POST to `/api/lessons/[id]/questions`
- [ ] Verify question is created with correct `userId`

#### Test 2.5: Enrollments API (Protected)
- [ ] While logged in, go to dashboard
- [ ] Check Network tab for GET to `/api/enrollments`
- [ ] Verify response includes user's enrollments
- [ ] Logout
- [ ] Refresh dashboard
- [ ] Check same API call
- [ ] Verify response: empty enrollments (unauthenticated)

### 3. Session Management Tests

#### Test 3.1: Client-Side Session Access
Open browser console (F12) → Console tab
- [ ] Login with test user
- [ ] Navigate to any page in the app
- [ ] In console, check if session is accessible (inspect React components)
- [ ] Verify `session.user.id` is `"68fe8de203d459186abf9d39"`
- [ ] Verify `session.user.email` is `"test@example.com"`

#### Test 3.2: Server-Side Session Access
Check server logs (terminal where `pnpm dev` is running)
- [ ] While logged in, enroll in a course
- [ ] Check terminal logs for enrollment API
- [ ] Verify no "Unauthorized" errors
- [ ] Verify session user ID is correctly retrieved

#### Test 3.3: Session Expiration
- [ ] Login successfully
- [ ] Leave browser open for extended period
- [ ] After session expires, try to access protected route
- [ ] Verify redirect to login
- [ ] Login again
- [ ] Verify can access protected routes again

### 4. Integration with Course Learning Flow

#### Test 4.1: Complete Enrollment Flow
- [ ] Login as test user
- [ ] Browse courses at http://localhost:3004
- [ ] Click on a course card
- [ ] View course details page
- [ ] Verify "Enroll Now" button is visible
- [ ] Click "Enroll Now"
- [ ] Verify success message
- [ ] Verify button changes to "Continue Learning"
- [ ] Click "Continue Learning"
- [ ] Verify redirect to first lesson

#### Test 4.2: Progress Persistence
- [ ] Login and enroll in a course
- [ ] Complete first lesson (watch video, complete quiz if present)
- [ ] Verify progress updates
- [ ] Logout
- [ ] Login again
- [ ] Navigate to course details
- [ ] Verify progress is still shown
- [ ] Click "Continue Learning"
- [ ] Verify redirects to correct lesson (next incomplete or last accessed)

#### Test 4.3: Multi-Device Session (Optional)
- [ ] Login on one browser (e.g., Chrome)
- [ ] Enroll in a course
- [ ] Open another browser (e.g., Firefox)
- [ ] Login with same credentials
- [ ] Verify enrollments are synced
- [ ] Complete a lesson in Browser 1
- [ ] Refresh Browser 2
- [ ] Verify progress is synced

## API Endpoint Testing Commands

### Test Session Endpoint (GET)
```bash
# When logged in (copy session cookie from browser DevTools)
curl http://localhost:3004/api/auth/session \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Test Enroll Endpoint (POST)
```bash
# Replace COURSE_ID and SESSION_TOKEN
curl -X POST http://localhost:3004/api/courses/COURSE_ID/enroll \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json"
```

### Test Progress Endpoint (GET)
```bash
# Replace COURSE_ID and SESSION_TOKEN
curl http://localhost:3004/api/progress/COURSE_ID \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

## Expected Results Summary

✅ **All tests should pass if:**
1. Login page is accessible and functional
2. Valid credentials successfully authenticate
3. Invalid credentials show appropriate errors
4. Session persists across page refreshes
5. Protected API routes return 401 when not authenticated
6. Protected API routes work correctly when authenticated
7. User data (enrollments, progress) is correctly associated with session user ID
8. Logout clears session and redirects appropriately
9. Course enrollment flow works end-to-end
10. Progress tracking persists across sessions

## Troubleshooting

### Issue: Login redirects back to login page
- Check: NEXTAUTH_SECRET is set in .env.local
- Check: NEXTAUTH_URL matches your dev server (http://localhost:3004)
- Check: MongoDB connection is working
- Check browser console for errors

### Issue: "Invalid credentials" with correct password
- Verify user exists in MongoDB Users collection
- Check password is bcrypt-hashed (starts with `$2a$` or `$2b$`)
- Verify email is exactly `test@example.com`

### Issue: Session not persisting
- Check browser cookies are enabled
- Verify `next-auth.session-token` cookie is set (in DevTools → Application → Cookies)
- Check cookie domain and path settings

### Issue: Protected routes returning 401 even when logged in
- Verify `getServerSession()` is being called correctly in API routes
- Check `session.user.id` exists in session
- Verify imports: `import { getServerSession } from '@/lib/auth'`

### Issue: TypeScript errors in API routes
- Verify all `getServerSession(authOptions)` changed to `getServerSession()`
- Check imports don't include `authOptions`
- Run: `cd user && pnpm run build` to check for compile errors

## Next Steps After Testing

Once all authentication tests pass:
1. ✅ Mark "Test Authentication Flow" as complete
2. 🚀 Move to "End-to-End Testing" (Task 18)
3. 📋 Follow TESTING_GUIDE.md for complete course learning flow
4. 🎓 Test full user journey: Browse → Enroll → Learn → Complete
